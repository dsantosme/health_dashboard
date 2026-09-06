/**
 * MOD-04 — humano no loop por risco (F-04.1).
 *
 * Satisfaz R14 e R15 de `.kiro/specs/gateway/requirements.md`, e US-09.
 *
 * Duas regras de ST-04 que este arquivo torna executáveis:
 *
 *  - Ação `write` ou `irreversible` **pausa e pede aprovação com evidência**.
 *  - Sem resposta em 4 horas, a ação é **cancelada**, nunca executada por
 *    decurso de prazo. Um timeout que aprova é um timeout que vaza.
 */
import type { Attribution, RiskClass } from "../../_shared/ids";

/** Prazo de ST-04 / US-09. */
export const APPROVAL_TIMEOUT_MS = 4 * 60 * 60 * 1000;

export interface Action extends Attribution {
  /** Verbo do trabalho: `consultar_pedido`, `emitir_nf`, `enviar_email`. */
  name: string;
  /** Sistema onde a ação acontece. */
  target: string;
  /** O que exatamente muda — vira a evidência mostrada ao aprovador. */
  payload?: Record<string, unknown>;
  /** Sai do ambiente para um terceiro (e-mail ao cliente final, pagamento)? */
  external?: boolean;
  /** Pode ser desfeita com uma operação equivalente? */
  reversible?: boolean;
  /** Só lê estado, sem alterar nada? */
  readOnly?: boolean;
}

export type ApprovalState =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "executed";

export interface ApprovalRequest {
  id: string;
  action: Action;
  risk: RiskClass;
  requestedAt: Date;
  expiresAt: Date;
  state: ApprovalState;
  /** O que o aprovador precisa ver para decidir sem abrir outro sistema. */
  evidence: string;
  decidedBy?: string;
  decidedAt?: Date;
}

/**
 * Classifica pela tabela de ST-04. Na dúvida, sobe o risco: classificar a menos
 * é o erro que custa caro, classificar a mais só custa uma aprovação.
 */
export function classify(action: Action): RiskClass {
  if (action.readOnly === true) return "read";
  if (action.external === true) return "irreversible";
  if (action.reversible === false) return "irreversible";
  if (action.reversible === true) return "write";
  // Nada declarado: não é leitura conhecida, então não é `read`.
  return "irreversible";
}

/** Só `read` dispensa aprovação (R15). */
export function requiresApproval(risk: RiskClass): boolean {
  return risk !== "read";
}

export function describeEvidence(action: Action): string {
  const linhas = [
    `Ação: ${action.name}`,
    `Sistema: ${action.target}`,
    `Agente: ${action.agentId} · Caso de uso: ${action.useCaseId}`,
  ];
  if (action.clientId) linhas.push(`Cliente: ${action.clientId}`);
  if (action.payload) {
    linhas.push("O que muda:");
    for (const [chave, valor] of Object.entries(action.payload)) {
      linhas.push(`  ${chave}: ${JSON.stringify(valor)}`);
    }
  }
  return linhas.join("\n");
}

export class ApprovalRequiredError extends Error {
  constructor(readonly request: ApprovalRequest) {
    super(
      `Ação "${request.action.name}" classificada como ${request.risk} exige aprovação ` +
        `(ST-04). Solicitação ${request.id}, expira em ${request.expiresAt.toISOString()}.`
    );
    this.name = "ApprovalRequiredError";
  }
}

/**
 * Fila de aprovações em memória. O relógio entra por parâmetro (ADR-0001): sem
 * isso, testar "expira em 4h" exigiria esperar 4 horas.
 */
export class ApprovalQueue {
  private readonly requests = new Map<string, ApprovalRequest>();
  private sequence = 0;

  constructor(private readonly now: () => Date) {}

  /**
   * Submete a ação. Devolve `null` quando ela é `read` e pode seguir direto;
   * devolve a solicitação pendente quando exige aprovação (R14, R15).
   */
  submit(action: Action): ApprovalRequest | null {
    const risk = classify(action);
    if (!requiresApproval(risk)) return null;

    const requestedAt = this.now();
    const request: ApprovalRequest = {
      id: `AP-${String(++this.sequence).padStart(4, "0")}`,
      action,
      risk,
      requestedAt,
      expiresAt: new Date(requestedAt.getTime() + APPROVAL_TIMEOUT_MS),
      state: "pending",
      evidence: describeEvidence(action),
    };
    this.requests.set(request.id, request);
    return request;
  }

  get(id: string): ApprovalRequest | undefined {
    return this.requests.get(id);
  }

  /**
   * Estado atual, já aplicando a expiração. É aqui que "sem resposta em 4h
   * cancela" vira comportamento, e não promessa (US-09).
   */
  refresh(id: string): ApprovalRequest {
    const request = this.mustGet(id);
    if (request.state === "pending" && this.now() >= request.expiresAt) {
      request.state = "cancelled";
      request.decidedAt = request.expiresAt;
      request.decidedBy = "timeout";
    }
    return request;
  }

  approve(id: string, by: string): ApprovalRequest {
    const request = this.refresh(id);
    if (request.state !== "pending") {
      throw new Error(
        `Solicitação ${id} está ${request.state} e não pode ser aprovada. ` +
          `Se ainda for necessária, submeta a ação novamente.`
      );
    }
    request.state = "approved";
    request.decidedBy = by;
    request.decidedAt = this.now();
    return request;
  }

  reject(id: string, by: string): ApprovalRequest {
    const request = this.refresh(id);
    if (request.state !== "pending") {
      throw new Error(
        `Solicitação ${id} está ${request.state} e não pode ser rejeitada.`
      );
    }
    request.state = "rejected";
    request.decidedBy = by;
    request.decidedAt = this.now();
    return request;
  }

  /** Executa apenas o que foi aprovado e ainda não executado. */
  async execute<T>(
    id: string,
    run: (action: Action) => Promise<T>
  ): Promise<T> {
    const request = this.refresh(id);
    if (request.state !== "approved") {
      throw new ApprovalRequiredError(request);
    }
    const result = await run(request.action);
    request.state = "executed";
    return result;
  }

  pending(): ApprovalRequest[] {
    return [...this.requests.keys()]
      .map(id => this.refresh(id))
      .filter(r => r.state === "pending");
  }

  private mustGet(id: string): ApprovalRequest {
    const request = this.requests.get(id);
    if (!request) throw new Error(`Solicitação de aprovação ${id} não existe.`);
    return request;
  }
}
