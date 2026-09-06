/**
 * MOD-01 — AI Gateway (FT-04.1, FT-04.3).
 *
 * Satisfaz R1..R8 de `.kiro/specs/gateway/requirements.md` e US-05.
 *
 * Todo agente do ORBE chama modelos **por aqui**. É o único lugar onde três
 * coisas acontecem juntas, e é por isso que ele existe: a política escolhe o
 * modelo, a PII sai do texto antes do provedor ver, e o custo é atribuído a um
 * agente e a um caso de uso. Chamada direta a SDK de provedor fora de
 * `src/gateway/adapters/` é bug (ST-02).
 */
import type { Attribution } from "../../_shared/ids";
import type { Guardrail } from "../../guardrails/ports/Guardrail";
import type { InMemoryCostLedger } from "../../finops/domain/ledger";
import type { Message, ModelProvider } from "../ports/ModelProvider";
import type { RoutingConstraints, RoutingPolicy } from "./routing";

export interface GatewayRequest extends Attribution {
  messages: Message[];
  constraints?: RoutingConstraints;
  maxTokens?: number;
}

export interface Attempt {
  model: string;
  ok: boolean;
  error?: string;
  latencyMs?: number;
}

export interface GatewayResponse {
  content: string;
  model: string;
  /** Toda tentativa, na ordem — inclusive as que falharam (R4, R5). */
  attempts: Attempt[];
  cost: number;
  /** Tipos de PII mascarados, com contagem. Seguro para log (R9). */
  masked: Record<string, number>;
}

export class GatewayError extends Error {
  constructor(
    message: string,
    readonly code:
      | "attribution_missing"
      | "budget_exceeded"
      | "pii_leak"
      | "all_providers_failed",
    readonly attempts: Attempt[] = []
  ) {
    super(message);
    this.name = "GatewayError";
  }
}

export interface GatewayDeps {
  policy: RoutingPolicy;
  provider: ModelProvider;
  guardrail: Guardrail;
  ledger: InMemoryCostLedger;
  /** O relógio entra por parâmetro: é o que torna orçamento e evals determinísticos. */
  now: () => Date;
}

export class Gateway {
  constructor(private readonly deps: GatewayDeps) {}

  async complete(request: GatewayRequest): Promise<GatewayResponse> {
    const { policy, provider, guardrail, ledger, now } = this.deps;

    // R7: custo não atribuível é custo invisível. Falha antes de gastar.
    if (!request.agentId || !request.useCaseId) {
      throw new GatewayError(
        "Chamada sem agentId ou useCaseId. Toda chamada declara quem pediu e para " +
          "qual caso de uso, senão o custo não pode ser atribuído (P-06, US-05).",
        "attribution_missing"
      );
    }

    const at = now();

    // R8: teto de orçamento antes de qualquer token.
    const budget = ledger.checkBudget(request.agentId, at);
    if (!budget.allowed) {
      throw new GatewayError(
        budget.reason ?? "Orçamento indisponível.",
        "budget_exceeded"
      );
    }

    // R1..R3: a política pode recusar aqui, sem chamar provedor algum.
    const candidates = policy.select(request.constraints ?? {});

    // R9, R10: mascarar antes de enviar. Só o conteúdo do usuário — a mensagem
    // de sistema é nossa e não carrega dado de cliente.
    const masked = request.messages.map(message =>
      message.role === "system"
        ? { message, guarded: null }
        : { message, guarded: guardrail.maskInput(message.content) }
    );
    const outbound: Message[] = masked.map(({ message, guarded }) =>
      guarded ? { ...message, content: guarded.text } : message
    );
    const maskedCounts: Record<string, number> = {};
    for (const { guarded } of masked) {
      for (const [type, n] of Object.entries(guarded?.counts ?? {})) {
        maskedCounts[type] = (maskedCounts[type] ?? 0) + (n as number);
      }
    }
    // Para restaurar a saída, o que importa é o conjunto de marcadores emitidos.
    const allTokens = new Map<string, string>();
    for (const { guarded } of masked) {
      for (const [token, value] of guarded?.tokens ?? [])
        allTokens.set(token, value);
    }

    const attempts: Attempt[] = [];
    let lastError: unknown;

    // R4, R5: tenta na ordem da política; registra cada tentativa.
    for (const candidate of candidates) {
      try {
        const result = await provider.complete({
          model: candidate.id,
          messages: outbound,
          maxTokens: request.maxTokens,
        });
        attempts.push({
          model: candidate.id,
          ok: true,
          latencyMs: result.latencyMs,
        });

        // R6: o custo é registrado para a tentativa que deu certo.
        const entry = ledger.recordUsage({
          agentId: request.agentId,
          useCaseId: request.useCaseId,
          clientId: request.clientId,
          at,
          model: candidate.id,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          succeeded: true,
        });

        // R11, R12: restaura o que foi mascarado; bloqueia PII que apareceu do nada.
        const verdict = guardrail.inspectOutput(result.content, {
          text: "",
          tokens: allTokens,
          counts: {},
        });
        if (!verdict.ok) {
          throw new GatewayError(
            `Resposta bloqueada: contém ${verdict.leaked.join(", ")} que não estava na entrada. ` +
              `Pode ser alucinação de dado pessoal ou vazamento de outro contexto (US-06, US-08).`,
            "pii_leak",
            attempts
          );
        }

        return {
          content: verdict.text,
          model: candidate.id,
          attempts,
          cost: entry.amount,
          masked: maskedCounts,
        };
      } catch (error) {
        // Bloqueio de PII não é falha de provedor: não adianta tentar outro modelo.
        if (error instanceof GatewayError) throw error;

        lastError = error;
        const message = error instanceof Error ? error.message : String(error);
        attempts.push({ model: candidate.id, ok: false, error: message });

        // R6: a tentativa que falhou consumiu tokens de entrada. Registra custo
        // estimado com saída zero — ignorá-la subestima o custo por resultado.
        ledger.recordUsage({
          agentId: request.agentId,
          useCaseId: request.useCaseId,
          clientId: request.clientId,
          at,
          model: candidate.id,
          inputTokens: estimateTokens(outbound),
          outputTokens: 0,
          succeeded: false,
        });
      }
    }

    // R5: todos falharam — propaga o último erro com o histórico completo.
    throw new GatewayError(
      `Todos os ${candidates.length} modelo(s) elegíveis falharam. Último erro: ` +
        `${lastError instanceof Error ? lastError.message : String(lastError)}`,
      "all_providers_failed",
      attempts
    );
  }
}

/**
 * Estimativa grosseira para o lançamento de custo de tentativa falha: ~4
 * caracteres por token. Serve para não perder o gasto de vista; a conciliação
 * exata vem do billing do provedor (F-06.1, tarefa T12).
 */
function estimateTokens(messages: Message[]): number {
  return Math.ceil(messages.reduce((n, m) => n + m.content.length, 0) / 4);
}
