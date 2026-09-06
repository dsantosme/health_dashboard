/**
 * MOD-02 — contrato de guardrail (ADR-0001).
 *
 * O domínio do gateway conhece só esta interface. Trocar a implementação por
 * Bedrock Guardrails, quando a decisão de compra for tomada (P-11), é escrever
 * um adapter — não mexer no gateway.
 */
import type { PiiType } from "../domain/pii";

export interface MaskedInput {
  /** Texto pronto para ir ao provedor, sem PII em claro. */
  text: string;
  /** marcador → valor. Vive só durante a chamada; nunca persistir (ST-04). */
  tokens: Map<string, string>;
  /** Quantidade por tipo — seguro para log de auditoria. */
  counts: Partial<Record<PiiType, number>>;
}

export type OutputVerdict =
  | { ok: true; text: string }
  | { ok: false; reason: "pii_leak"; leaked: PiiType[] };

export interface Guardrail {
  /** Mascara PII antes de enviar ao modelo (R9, R10). */
  maskInput(text: string): MaskedInput;
  /**
   * Restaura os marcadores emitidos e bloqueia se sobrar PII que não estava na
   * entrada (R11, R12). Bloquear, não filtrar: PII nova pode ser vazamento do
   * índice de outro cliente (US-08).
   */
  inspectOutput(text: string, input: MaskedInput): OutputVerdict;
}
