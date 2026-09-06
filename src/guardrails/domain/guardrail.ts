/**
 * MOD-02 — guardrail de PII para entrada e saída (F-02.1).
 *
 * Satisfaz R9..R12 de `.kiro/specs/gateway/requirements.md`.
 */
import type { Guardrail, MaskedInput, OutputVerdict } from "../ports/Guardrail";
import { detectPii, maskPii, unmaskPii, type PiiType } from "./pii";

export class PiiGuardrail implements Guardrail {
  maskInput(text: string): MaskedInput {
    const { masked, tokens, counts } = maskPii(text);
    return { text: masked, tokens, counts };
  }

  /**
   * Restaura o que foi mascarado e depois procura PII no resultado. O que sobra
   * é PII que o modelo produziu sem ter recebido — alucinação de dado pessoal ou
   * vazamento de outro contexto. Nos dois casos, bloqueia (R12).
   *
   * Filtrar em silêncio seria pior: esconderia justamente o sinal de que o
   * índice de um cliente vazou para outro (US-08).
   */
  inspectOutput(text: string, input: MaskedInput): OutputVerdict {
    const restored = unmaskPii(text, input.tokens);
    const fromInput = new Set(input.tokens.values());

    const leaked = new Set<PiiType>();
    for (const match of detectPii(restored)) {
      if (!fromInput.has(match.value)) leaked.add(match.type);
    }
    if (leaked.size > 0) {
      return { ok: false, reason: "pii_leak", leaked: [...leaked] };
    }
    return { ok: true, text: restored };
  }
}
