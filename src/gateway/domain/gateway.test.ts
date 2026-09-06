import { describe, expect, it } from "vitest";
import { Gateway, GatewayError, type GatewayRequest } from "./gateway";
import { CostAwareRoutingPolicy } from "./routing";
import {
  ScriptedModelProvider,
  type ScriptedBehavior,
} from "../adapters/ScriptedModelProvider";
import { PiiGuardrail } from "../../guardrails/domain/guardrail";
import { InMemoryCostLedger } from "../../finops/domain/ledger";
import type { ModelSpec } from "../ports/ModelProvider";
import type { AgentId, FeatureId } from "../../_shared/ids";

const CPF = "529.982.247-25";
const OUTRO_CPF = "168.995.350-09";
const AG: AgentId = "AG-03";
const FT: FeatureId = "FT-04.1";
const AGORA = new Date("2026-09-06T10:00:00Z");

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
];

function montar(
  script: Record<string, ScriptedBehavior>,
  dailyBudget = { "AG-03": 10 }
) {
  const provider = new ScriptedModelProvider(script);
  const ledger = new InMemoryCostLedger({
    pricing: {
      barato: { inputPerMillion: 5, outputPerMillion: 25 },
      medio: { inputPerMillion: 20, outputPerMillion: 100 },
    },
    dailyBudget,
  });
  const gateway = new Gateway({
    policy: new CostAwareRoutingPolicy(CATALOGO),
    provider,
    guardrail: new PiiGuardrail(),
    ledger,
    now: () => AGORA,
  });
  return { gateway, provider, ledger };
}

const pedido = (over: Partial<GatewayRequest> = {}): GatewayRequest => ({
  agentId: AG,
  useCaseId: FT,
  messages: [{ role: "user", content: "Qual o status do pedido?" }],
  ...over,
});

describe("Gateway — atribuição (R7, US-05)", () => {
  it("R7: recusa chamada sem agentId", async () => {
    const { gateway } = montar({ barato: { kind: "reply", content: "ok" } });
    await expect(
      gateway.complete(pedido({ agentId: undefined as never }))
    ).rejects.toMatchObject({
      code: "attribution_missing",
    });
  });

  it("R7: recusa chamada sem useCaseId", async () => {
    const { gateway } = montar({ barato: { kind: "reply", content: "ok" } });
    await expect(
      gateway.complete(pedido({ useCaseId: undefined as never }))
    ).rejects.toMatchObject({
      code: "attribution_missing",
    });
  });

  it("R6: registra custo com agente e caso de uso na chamada bem-sucedida", async () => {
    const { gateway, ledger } = montar({
      barato: { kind: "reply", content: "Entregue." },
    });
    const resposta = await gateway.complete(pedido());

    expect(resposta.model).toBe("barato");
    const [linha] = ledger.report(AGORA);
    expect(linha.agentId).toBe(AG);
    expect(linha.useCaseId).toBe(FT);
    expect(linha.successes).toBe(1);
    expect(resposta.cost).toBeGreaterThan(0);
  });
});

describe("Gateway — roteamento e fallback (R1..R5)", () => {
  it("R1: usa o modelo mais barato elegível", async () => {
    const { gateway, provider } = montar({
      barato: { kind: "reply", content: "ok" },
      medio: { kind: "reply", content: "ok" },
    });
    await gateway.complete(pedido());
    expect(provider.seen.map(r => r.model)).toEqual(["barato"]);
  });

  it("R2: dado regulado pula o modelo não autorizado", async () => {
    const { gateway } = montar({
      barato: { kind: "reply", content: "não deveria" },
      medio: { kind: "reply", content: "ok" },
    });
    const resposta = await gateway.complete(
      pedido({ constraints: { regulated: true } })
    );
    expect(resposta.model).toBe("medio");
  });

  it("R3: política sem candidato recusa sem chamar provedor", async () => {
    const { gateway, provider } = montar({
      barato: { kind: "reply", content: "x" },
    });
    await expect(
      gateway.complete(
        pedido({ constraints: { regulated: true, maxLatencyMs: 10 } })
      )
    ).rejects.toThrow(/Nenhum modelo atende à política/);
    expect(provider.seen).toHaveLength(0);
  });

  it("R4: cai para o próximo modelo e registra as duas tentativas", async () => {
    const { gateway } = montar({
      barato: { kind: "fail", message: "429 throttled" },
      medio: { kind: "reply", content: "Entregue." },
    });
    const resposta = await gateway.complete(pedido());

    expect(resposta.model).toBe("medio");
    expect(resposta.attempts).toEqual([
      { model: "barato", ok: false, error: "429 throttled" },
      { model: "medio", ok: true, latencyMs: 100 },
    ]);
  });

  it("R6: a tentativa que falhou também vira custo — ela consumiu tokens", async () => {
    const { gateway, ledger } = montar({
      barato: { kind: "fail", message: "500" },
      medio: { kind: "reply", content: "ok" },
    });
    await gateway.complete(pedido());
    const [linha] = ledger.report(AGORA);
    expect(linha.calls).toBe(2);
    expect(linha.successes).toBe(1);
  });

  it("R5: todos falhando, propaga com o histórico completo", async () => {
    const { gateway } = montar({
      barato: { kind: "fail", message: "500" },
      medio: { kind: "fail", message: "503" },
    });
    const erro = await gateway.complete(pedido()).catch(e => e as GatewayError);
    expect(erro.code).toBe("all_providers_failed");
    expect(erro.message).toContain("503");
    expect(erro.attempts).toHaveLength(2);
  });
});

describe("Gateway — guardrails (R9, R11, R12, US-06)", () => {
  it("R9: PII não chega ao provedor", async () => {
    const { gateway, provider } = montar({
      barato: { kind: "reply", content: "ok" },
    });
    await gateway.complete(
      pedido({
        messages: [{ role: "user", content: `Cliente ${CPF} reclamou.` }],
      })
    );
    const enviado = provider.seen[0].messages[0].content;
    expect(enviado).not.toContain(CPF);
    expect(enviado).toContain("«CPF_1»");
  });

  it("R9: a resposta reporta contagem por tipo, nunca o valor", async () => {
    const { gateway } = montar({ barato: { kind: "reply", content: "ok" } });
    const resposta = await gateway.complete(
      pedido({ messages: [{ role: "user", content: `${CPF} e ana@x.com` }] })
    );
    expect(resposta.masked).toEqual({ CPF: 1, EMAIL: 1 });
  });

  it("R11: restaura na resposta a PII que veio da entrada", async () => {
    const { gateway } = montar({
      barato: { kind: "reply", content: "O titular «CPF_1» consta." },
    });
    const resposta = await gateway.complete(
      pedido({ messages: [{ role: "user", content: `Titular ${CPF}` }] })
    );
    expect(resposta.content).toBe(`O titular ${CPF} consta.`);
  });

  it("R12: bloqueia resposta com PII que não estava na entrada", async () => {
    const { gateway } = montar({
      barato: { kind: "reply", content: `O CPF é ${OUTRO_CPF}.` },
    });
    await expect(gateway.complete(pedido())).rejects.toMatchObject({
      code: "pii_leak",
    });
  });

  it("R12: vazamento não vira fallback — trocar de modelo não conserta vazamento", async () => {
    const { gateway, provider } = montar({
      barato: { kind: "reply", content: `CPF ${OUTRO_CPF}` },
      medio: { kind: "reply", content: "ok" },
    });
    await expect(gateway.complete(pedido())).rejects.toMatchObject({
      code: "pii_leak",
    });
    expect(provider.seen.map(r => r.model)).toEqual(["barato"]);
  });

  it("a mensagem de sistema passa intacta — ela é nossa, não do cliente", async () => {
    const { gateway, provider } = montar({
      barato: { kind: "reply", content: "ok" },
    });
    await gateway.complete(
      pedido({
        messages: [
          { role: "system", content: "Responda em português." },
          { role: "user", content: "Oi" },
        ],
      })
    );
    expect(provider.seen[0].messages[0].content).toBe("Responda em português.");
  });
});

describe("Gateway — orçamento (R8)", () => {
  it("R8: agente com teto estourado não chama provedor", async () => {
    const { gateway, provider, ledger } = montar({
      barato: { kind: "reply", content: "ok" },
    });
    ledger.record({
      agentId: AG,
      useCaseId: FT,
      at: AGORA,
      model: "barato",
      inputTokens: 0,
      outputTokens: 0,
      amount: 10,
      succeeded: true,
    });
    await expect(gateway.complete(pedido())).rejects.toMatchObject({
      code: "budget_exceeded",
    });
    expect(provider.seen).toHaveLength(0);
  });

  it("agente sem teto declarado não chama (P-06)", async () => {
    const { gateway } = montar(
      { barato: { kind: "reply", content: "ok" } },
      {}
    );
    await expect(gateway.complete(pedido())).rejects.toMatchObject({
      code: "budget_exceeded",
    });
  });
});
