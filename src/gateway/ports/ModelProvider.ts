/**
 * MOD-01 — contrato de provedor de modelo (ADR-0001).
 *
 * Bedrock, Azure AI Foundry ou um duplo de teste implementam isto. O domínio do
 * gateway não sabe qual está do outro lado — é o que permite trocar de provedor
 * por política de dados sem tocar em agente algum (P-08, F-01.3).
 */

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompletionRequest {
  model: string;
  messages: Message[];
  maxTokens?: number;
}

export interface CompletionResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  /** Latência observada, usada pela política e pelo painel (F-05.2). */
  latencyMs: number;
}

export interface ModelProvider {
  /**
   * Executa a completude. Deve lançar em falha — o gateway trata o erro,
   * registra a tentativa e decide o fallback (R4, R5).
   */
  complete(request: CompletionRequest): Promise<CompletionResult>;
}

/** Descrição de um modelo para a política de roteamento. */
export interface ModelSpec {
  id: string;
  /** Custo relativo, para ordenar do mais barato ao mais caro. */
  costRank: number;
  /** Latência típica p95, em ms. */
  p95LatencyMs: number;
  /** Se a política de dados permite enviar dado regulado a este modelo (R2). */
  allowsRegulatedData: boolean;
  /** Qualidade relativa, para casos de uso que exigem um piso. */
  qualityRank: number;
}
