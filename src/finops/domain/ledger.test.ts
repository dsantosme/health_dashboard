import { describe, expect, it } from "vitest";
import { InMemoryCostLedger, priceOf, type LedgerConfig } from "./ledger";
import type { AgentId, FeatureId } from "../../_shared/ids";

const AG: AgentId = "AG-03";
const FT: FeatureId = "FT-04.1";

const config: LedgerConfig = {
  pricing: {
    "claude-barato": { inputPerMillion: 5, outputPerMillion: 25 },
    "claude-caro": { inputPerMillion: 20, outputPerMillion: 100 },
  },
  dailyBudget: { "AG-03": 10 },
};

const hoje = new Date("2026-09-06T10:00:00Z");
const amanha = new Date("2026-09-07T10:00:00Z");

const uso = (
  over: Partial<Parameters<InMemoryCostLedger["recordUsage"]>[0]> = {}
) => ({
  agentId: AG,
  useCaseId: FT,
  at: hoje,
  model: "claude-barato",
  inputTokens: 100_000,
  outputTokens: 20_000,
  succeeded: true,
  ...over,
});

describe("priceOf", () => {
  it("calcula pela tabela de preços", () => {
    // 100k entrada × R$5/M + 20k saída × R$25/M = 0,5 + 0,5 = 1,00
    expect(priceOf(config.pricing, "claude-barato", 100_000, 20_000)).toBe(1);
  });

  it("recusa modelo sem preço — chamada sem custo conhecido não vai a produção", () => {
    expect(() => priceOf(config.pricing, "modelo-novo", 1, 1)).toThrow(
      /Sem preço para o modelo/
    );
  });
});

describe("InMemoryCostLedger — orçamento (R8)", () => {
  it("permite enquanto o gasto do dia estiver abaixo do teto", () => {
    const ledger = new InMemoryCostLedger(config);
    ledger.recordUsage(uso());
    const veredito = ledger.checkBudget(AG, hoje);
    expect(veredito.allowed).toBe(true);
    expect(veredito.spentToday).toBe(1);
  });

  it("R8: recusa quando o teto diário é atingido", () => {
    const ledger = new InMemoryCostLedger(config);
    for (let i = 0; i < 10; i++) ledger.recordUsage(uso());
    const veredito = ledger.checkBudget(AG, hoje);
    expect(veredito.allowed).toBe(false);
    expect(veredito.reason).toMatch(/estourado/);
  });

  it("o teto é diário: o gasto de ontem não bloqueia hoje", () => {
    const ledger = new InMemoryCostLedger(config);
    for (let i = 0; i < 10; i++) ledger.recordUsage(uso());
    expect(ledger.checkBudget(AG, amanha).allowed).toBe(true);
  });

  it("agente sem teto declarado não chama (P-06)", () => {
    const ledger = new InMemoryCostLedger(config);
    // AG-10 existe no plano, mas não tem teto nesta configuração — é esse o
    // caso real: o agente foi criado e ninguém declarou o orçamento dele.
    const veredito = ledger.checkBudget("AG-10", hoje);
    expect(veredito.allowed).toBe(false);
    expect(veredito.reason).toMatch(/não tem orçamento diário declarado/);
  });
});

describe("InMemoryCostLedger — relatório (R6, US-12)", () => {
  it("R6: registra custo de tentativa que falhou", () => {
    const ledger = new InMemoryCostLedger(config);
    ledger.recordUsage(uso({ succeeded: false, outputTokens: 0 }));
    const [linha] = ledger.report(hoje);
    expect(linha.calls).toBe(1);
    expect(linha.successes).toBe(0);
    expect(linha.totalCost).toBeGreaterThan(0);
  });

  it("custo por resultado é infinito quando nada deu certo — não zero", () => {
    const ledger = new InMemoryCostLedger(config);
    ledger.recordUsage(uso({ succeeded: false }));
    expect(ledger.report(hoje)[0].costPerResult).toBe(Number.POSITIVE_INFINITY);
  });

  it("agrega por agente e caso de uso, e ordena pelo mais caro", () => {
    const ledger = new InMemoryCostLedger(config);
    ledger.recordUsage(uso());
    ledger.recordUsage(uso());
    ledger.recordUsage(uso({ useCaseId: "FT-04.2", model: "claude-caro" }));

    const linhas = ledger.report(hoje);
    expect(linhas).toHaveLength(2);
    expect(linhas[0].useCaseId).toBe("FT-04.2"); // mais caro primeiro
    const barato = linhas.find(l => l.useCaseId === FT);
    expect(barato?.calls).toBe(2);
    expect(barato?.costPerResult).toBe(1);
  });

  it("o relatório é do dia consultado", () => {
    const ledger = new InMemoryCostLedger(config);
    ledger.recordUsage(uso());
    expect(ledger.report(amanha)).toHaveLength(0);
  });
});
