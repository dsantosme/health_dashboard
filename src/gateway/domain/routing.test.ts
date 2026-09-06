import { describe, expect, it } from "vitest";
import { CostAwareRoutingPolicy, NoEligibleModelError } from "./routing";
import type { ModelSpec } from "../ports/ModelProvider";

const CATALOGO: ModelSpec[] = [
  {
    id: "barato",
    costRank: 1,
    p95LatencyMs: 3000,
    allowsRegulatedData: false,
    qualityRank: 2,
  },
  {
    id: "medio",
    costRank: 2,
    p95LatencyMs: 1500,
    allowsRegulatedData: true,
    qualityRank: 3,
  },
  {
    id: "caro",
    costRank: 3,
    p95LatencyMs: 900,
    allowsRegulatedData: true,
    qualityRank: 5,
  },
];

describe("CostAwareRoutingPolicy", () => {
  const policy = new CostAwareRoutingPolicy(CATALOGO);

  it("R1: ordena do mais barato ao mais caro, para o fallback vir na sequência", () => {
    expect(policy.select({}).map(m => m.id)).toEqual([
      "barato",
      "medio",
      "caro",
    ]);
  });

  it("R2: dado regulado descarta modelo não autorizado, mesmo sendo o mais barato", () => {
    expect(policy.select({ regulated: true }).map(m => m.id)).toEqual([
      "medio",
      "caro",
    ]);
  });

  it("R1: descarta modelo acima da latência máxima", () => {
    expect(policy.select({ maxLatencyMs: 1000 }).map(m => m.id)).toEqual([
      "caro",
    ]);
  });

  it("R1: respeita o piso de qualidade do caso de uso", () => {
    expect(policy.select({ minQuality: 3 }).map(m => m.id)).toEqual([
      "medio",
      "caro",
    ]);
  });

  it("R3: sem candidato, recusa antes de chamar qualquer provedor", () => {
    expect(() => policy.select({ regulated: true, maxLatencyMs: 100 })).toThrow(
      NoEligibleModelError
    );
  });

  it("R3: o erro diz quem foi descartado e por quê — erro acionável (P-01)", () => {
    try {
      policy.select({ regulated: true, maxLatencyMs: 100 });
      expect.unreachable("deveria ter lançado");
    } catch (error) {
      const mensagem = (error as Error).message;
      expect(mensagem).toContain("barato (não permitido para dados regulados)");
      expect(mensagem).toContain("p95 900ms > 100ms");
      expect(mensagem).toContain("não foi enviada a provedor algum");
    }
  });

  it("catálogo vazio também recusa, sem quebrar", () => {
    expect(() => new CostAwareRoutingPolicy([]).select({})).toThrow(
      NoEligibleModelError
    );
  });

  it("empate de custo é desfeito pela maior qualidade", () => {
    const empate = new CostAwareRoutingPolicy([
      {
        id: "a",
        costRank: 1,
        p95LatencyMs: 100,
        allowsRegulatedData: true,
        qualityRank: 2,
      },
      {
        id: "b",
        costRank: 1,
        p95LatencyMs: 100,
        allowsRegulatedData: true,
        qualityRank: 4,
      },
    ]);
    expect(empate.select({}).map(m => m.id)).toEqual(["b", "a"]);
  });
});
