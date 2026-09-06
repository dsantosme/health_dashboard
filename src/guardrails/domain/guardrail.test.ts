import { describe, expect, it } from "vitest";
import { PiiGuardrail } from "./guardrail";

const CPF = "529.982.247-25";
const OUTRO_CPF = "168.995.350-09";

describe("PiiGuardrail", () => {
  const guardrail = new PiiGuardrail();

  it("R9: mascara a entrada e reporta a contagem, não o valor", () => {
    const entrada = guardrail.maskInput(`Titular ${CPF}, e-mail ana@x.com`);
    expect(entrada.text).not.toContain(CPF);
    expect(entrada.text).not.toContain("ana@x.com");
    expect(entrada.counts).toEqual({ CPF: 1, EMAIL: 1 });
  });

  it("R11: restaura na saída a PII que veio da entrada", () => {
    const entrada = guardrail.maskInput(`Titular ${CPF}`);
    const veredito = guardrail.inspectOutput(
      "O titular «CPF_1» está regular.",
      entrada
    );
    expect(veredito).toEqual({
      ok: true,
      text: `O titular ${CPF} está regular.`,
    });
  });

  it("R12: bloqueia PII na saída que não estava na entrada", () => {
    const entrada = guardrail.maskInput("Qual o telefone do titular?");
    const veredito = guardrail.inspectOutput(
      `O CPF dele é ${OUTRO_CPF}.`,
      entrada
    );
    expect(veredito).toEqual({
      ok: false,
      reason: "pii_leak",
      leaked: ["CPF"],
    });
  });

  it("R12: bloqueia mesmo quando a entrada tinha PII de outro valor", () => {
    // Caso que separa "restaurar" de "permitir": o CPF da entrada volta, mas o
    // segundo CPF nunca foi enviado ao modelo — é vazamento (US-08).
    const entrada = guardrail.maskInput(`Titular ${CPF}`);
    const veredito = guardrail.inspectOutput(
      `Titular «CPF_1» e sócio ${OUTRO_CPF}.`,
      entrada
    );
    expect(veredito.ok).toBe(false);
  });

  it("saída sem PII passa sem alteração", () => {
    const entrada = guardrail.maskInput("Quantos pedidos hoje?");
    expect(guardrail.inspectOutput("Foram 42 pedidos.", entrada)).toEqual({
      ok: true,
      text: "Foram 42 pedidos.",
    });
  });

  it("marcador inventado pelo modelo não vira PII nem some do texto", () => {
    const entrada = guardrail.maskInput("Sem dados pessoais aqui.");
    const veredito = guardrail.inspectOutput("Confira «CPF_7».", entrada);
    expect(veredito).toEqual({ ok: true, text: "Confira «CPF_7»." });
  });
});
