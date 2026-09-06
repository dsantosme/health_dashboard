/**
 * EV-01 — Engenharia (pods). Limiar ≥ 95% (docs/plan/plan.yaml), grader
 * determinístico por estado, cadência: cada PR.
 *
 * Vinte casos derivados das tarefas já implementadas de EP-04 e EP-05. Cada caso
 * cita o requisito EARS que verifica: é assim que uma falha aqui aponta para a
 * spec, e não só para uma linha de código.
 *
 * Regra do módulo: o caso devolve **estado final**, não texto. Onde a prova é
 * "a ação foi recusada", o estado é `{refused, message}` (`captureFailure`).
 */
import {
  captureFailure,
  refusedWith,
  stateEquals,
  stateSatisfies,
  type EvalCase,
  type EvalSuite,
  type Grader,
} from "../domain/runner";
import { Gateway } from "../../gateway/domain/gateway";
import { CostAwareRoutingPolicy } from "../../gateway/domain/routing";
import {
  ScriptedModelProvider,
  type ScriptedBehavior,
} from "../../gateway/adapters/ScriptedModelProvider";
import type { ModelSpec } from "../../gateway/ports/ModelProvider";
import { PiiGuardrail } from "../../guardrails/domain/guardrail";
import { InMemoryCostLedger } from "../../finops/domain/ledger";
import {
  KnowledgeBase,
  type Principal,
} from "../../knowledge/domain/knowledge";
import type { SourceDocument } from "../../knowledge/domain/chunking";
import {
  ApprovalQueue,
  APPROVAL_TIMEOUT_MS,
  classify,
} from "../../orchestration/domain/hitl";
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

function montarGateway(
  script: Record<string, ScriptedBehavior>,
  dailyBudget: Record<string, number> = { "AG-03": 10 }
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

const doc = (over: Partial<SourceDocument>): SourceDocument => ({
  id: "d1",
  clientId: "acme",
  title: "Política de trocas",
  type: "text",
  accessLabels: ["todos"],
  content: "Trocas aceitas em ate 30 dias com nota fiscal.",
  ...over,
});

const usuario = (over: Partial<Principal> = {}): Principal => ({
  userId: "u1",
  clientId: "acme",
  labels: ["todos"],
  ...over,
});

const baseCom = (...docs: SourceDocument[]) => {
  const kb = new KnowledgeBase();
  for (const d of docs) kb.ingest(d);
  return kb;
};

/**
 * Declara um caso com o tipo do seu próprio estado; a suíte guarda todos juntos,
 * então a coerção acontece uma vez, aqui, e não em cada caso.
 *
 * O `NoInfer` no grader é o detalhe que importa: sem ele, `stateEquals({...})`
 * estreitaria o tipo do estado para os literais esperados e o compilador
 * exigiria que `run` já devolvesse exatamente aquilo — o oposto do que um eval
 * faz. O estado vem de `run`; o grader julga o que veio.
 */
const caso = <S>(c: {
  id: string;
  description: string;
  requirement: string;
  run: () => S | Promise<S>;
  grade: Grader<NoInfer<Awaited<S>>>;
}): EvalCase<never> => c as unknown as EvalCase<never>;

export const EV_01: EvalSuite = {
  id: "EV-01",
  target: "Engenharia (pods) — MOD-01, MOD-02, MOD-03, MOD-04, MOD-06",
  threshold: 0.95,
  cases: [
    // ---------- Gateway: atribuição e custo (US-05) ----------
    caso({
      id: "EV-01.01",
      description: "chamada bem-sucedida produz lançamento de custo atribuído",
      requirement: "gateway R6",
      run: async () => {
        const { gateway, ledger } = montarGateway({
          barato: { kind: "reply", content: "ok" },
        });
        await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: "status?" }],
        });
        const [linha] = ledger.report(AGORA);
        return {
          agentId: linha.agentId,
          useCaseId: linha.useCaseId,
          successes: linha.successes,
        };
      },
      grade: stateEquals({ agentId: AG, useCaseId: FT, successes: 1 }),
    }),
    caso({
      id: "EV-01.02",
      description: "chamada sem agentId é recusada antes de gastar",
      requirement: "gateway R7",
      run: () => {
        const { gateway, provider } = montarGateway({
          barato: { kind: "reply", content: "ok" },
        });
        return captureFailure(async () => {
          await gateway.complete({
            agentId: undefined as never,
            useCaseId: FT,
            messages: [{ role: "user", content: "x" }],
          });
        }).then(r => ({ ...r, chamadas: provider.seen.length }));
      },
      grade: stateSatisfies(
        "recusada sem chamar provedor",
        (s: { refused: boolean; chamadas: number }) =>
          s.refused && s.chamadas === 0
      ),
    }),
    caso({
      id: "EV-01.03",
      description: "chamada sem useCaseId é recusada",
      requirement: "gateway R7",
      run: () => {
        const { gateway } = montarGateway({
          barato: { kind: "reply", content: "ok" },
        });
        return captureFailure(() =>
          gateway.complete({
            agentId: AG,
            useCaseId: undefined as never,
            messages: [{ role: "user", content: "x" }],
          })
        );
      },
      grade: refusedWith("useCaseId"),
    }),
    caso({
      id: "EV-01.04",
      description: "agente sem orçamento declarado não chama provedor",
      requirement: "gateway R8",
      run: () => {
        const { gateway, provider } = montarGateway(
          { barato: { kind: "reply", content: "ok" } },
          {}
        );
        return captureFailure(() =>
          gateway.complete({
            agentId: AG,
            useCaseId: FT,
            messages: [{ role: "user", content: "x" }],
          })
        ).then(r => ({ ...r, chamadas: provider.seen.length }));
      },
      grade: stateSatisfies(
        "recusada sem chamar provedor",
        (s: { refused: boolean; chamadas: number }) =>
          s.refused && s.chamadas === 0
      ),
    }),
    caso({
      id: "EV-01.05",
      description: "teto diário estourado bloqueia a chamada seguinte",
      requirement: "gateway R8",
      run: () => {
        const { gateway, ledger } = montarGateway({
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
        return captureFailure(() =>
          gateway.complete({
            agentId: AG,
            useCaseId: FT,
            messages: [{ role: "user", content: "x" }],
          })
        );
      },
      grade: refusedWith("estourado"),
    }),

    // ---------- Gateway: roteamento (US-05) ----------
    caso({
      id: "EV-01.06",
      description: "roteia para o modelo mais barato elegível",
      requirement: "gateway R1",
      run: async () => {
        const { gateway, provider } = montarGateway({
          barato: { kind: "reply", content: "ok" },
          medio: { kind: "reply", content: "ok" },
        });
        await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: "x" }],
        });
        return { modelos: provider.seen.map(r => r.model) };
      },
      grade: stateEquals({ modelos: ["barato"] }),
    }),
    caso({
      id: "EV-01.07",
      description: "dado regulado nunca vai ao modelo não autorizado",
      requirement: "gateway R2",
      run: async () => {
        const { gateway, provider } = montarGateway({
          barato: { kind: "reply", content: "não deveria" },
          medio: { kind: "reply", content: "ok" },
        });
        await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: "x" }],
          constraints: { regulated: true },
        });
        return { modelos: provider.seen.map(r => r.model) };
      },
      grade: stateEquals({ modelos: ["medio"] }),
    }),
    caso({
      id: "EV-01.08",
      description: "política sem candidato recusa sem tocar em provedor",
      requirement: "gateway R3",
      run: () => {
        const { gateway, provider } = montarGateway({
          barato: { kind: "reply", content: "x" },
        });
        return captureFailure(() =>
          gateway.complete({
            agentId: AG,
            useCaseId: FT,
            messages: [{ role: "user", content: "x" }],
            constraints: { regulated: true, maxLatencyMs: 10 },
          })
        ).then(r => ({ ...r, chamadas: provider.seen.length }));
      },
      grade: stateSatisfies(
        "recusada sem chamar provedor",
        (s: { refused: boolean; chamadas: number }) =>
          s.refused && s.chamadas === 0
      ),
    }),
    caso({
      id: "EV-01.09",
      description:
        "falha do primário cai para o fallback e registra as tentativas",
      requirement: "gateway R4",
      run: async () => {
        const { gateway } = montarGateway({
          barato: { kind: "fail", message: "429" },
          medio: { kind: "reply", content: "ok" },
        });
        const r = await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: "x" }],
        });
        return { modelo: r.model, tentativas: r.attempts.map(a => a.ok) };
      },
      grade: stateEquals({ modelo: "medio", tentativas: [false, true] }),
    }),
    caso({
      id: "EV-01.10",
      description: "todos os modelos falhando propaga erro com histórico",
      requirement: "gateway R5",
      run: () => {
        const { gateway } = montarGateway({
          barato: { kind: "fail", message: "500" },
          medio: { kind: "fail", message: "503" },
        });
        return captureFailure(() =>
          gateway.complete({
            agentId: AG,
            useCaseId: FT,
            messages: [{ role: "user", content: "x" }],
          })
        );
      },
      grade: refusedWith("503"),
    }),
    caso({
      id: "EV-01.11",
      description: "tentativa que falhou também vira custo",
      requirement: "gateway R6",
      run: async () => {
        const { gateway, ledger } = montarGateway({
          barato: { kind: "fail", message: "500" },
          medio: { kind: "reply", content: "ok" },
        });
        await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: "x" }],
        });
        const [linha] = ledger.report(AGORA);
        return { calls: linha.calls, successes: linha.successes };
      },
      grade: stateEquals({ calls: 2, successes: 1 }),
    }),

    // ---------- Guardrails (US-06) ----------
    caso({
      id: "EV-01.12",
      description: "CPF do usuário não chega ao provedor",
      requirement: "gateway R9",
      run: async () => {
        const { gateway, provider } = montarGateway({
          barato: { kind: "reply", content: "ok" },
        });
        await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: `Cliente ${CPF} reclamou.` }],
        });
        const enviado = provider.seen[0].messages[0].content;
        return {
          vazouCpf: enviado.includes(CPF),
          temMarcador: enviado.includes("«CPF_1»"),
        };
      },
      grade: stateEquals({ vazouCpf: false, temMarcador: true }),
    }),
    caso({
      id: "EV-01.13",
      description: "PII da entrada é restaurada na resposta ao agente",
      requirement: "gateway R11",
      run: async () => {
        const { gateway } = montarGateway({
          barato: { kind: "reply", content: "O titular «CPF_1» consta." },
        });
        const r = await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: `Titular ${CPF}` }],
        });
        return { content: r.content };
      },
      grade: stateEquals({ content: `O titular ${CPF} consta.` }),
    }),
    caso({
      id: "EV-01.14",
      description: "PII na saída ausente da entrada bloqueia a resposta",
      requirement: "gateway R12",
      run: () => {
        const { gateway } = montarGateway({
          barato: { kind: "reply", content: `O CPF é ${OUTRO_CPF}.` },
        });
        return captureFailure(() =>
          gateway.complete({
            agentId: AG,
            useCaseId: FT,
            messages: [{ role: "user", content: "qual o cpf?" }],
          })
        );
      },
      grade: refusedWith("não estava na entrada"),
    }),
    caso({
      id: "EV-01.15",
      description: "código interno de 11 dígitos não é mascarado como CPF",
      requirement: "gateway R13",
      run: async () => {
        const { gateway, provider } = montarGateway({
          barato: { kind: "reply", content: "ok" },
        });
        await gateway.complete({
          agentId: AG,
          useCaseId: FT,
          messages: [{ role: "user", content: "Pedido 12345678901 aprovado" }],
        });
        return { enviado: provider.seen[0].messages[0].content };
      },
      grade: stateEquals({ enviado: "Pedido 12345678901 aprovado" }),
    }),

    // ---------- RAG (US-07, US-08) ----------
    caso({
      id: "EV-01.16",
      description: "documento de outro cliente nunca é recuperado",
      requirement: "rag R5",
      run: () => {
        const kb = baseCom(
          doc({
            id: "d1",
            clientId: "acme",
            content: "Trocas da Acme com nota fiscal.",
          }),
          doc({
            id: "d2",
            clientId: "beta",
            content: "Trocas da Beta com nota fiscal.",
          })
        );
        const r = kb.retrieve({
          question: "trocas nota fiscal",
          principal: usuario(),
        });
        return {
          docs:
            r.kind === "answered"
              ? [...new Set(r.citations.map(c => c.docId))]
              : [],
        };
      },
      grade: stateEquals({ docs: ["d1"] }),
    }),
    caso({
      id: "EV-01.17",
      description: "consulta cruzada entre clientes é recusada",
      requirement: "rag R6",
      run: async () => {
        const kb = baseCom(doc({}));
        return captureFailure(async () =>
          kb.retrieve({
            question: "trocas",
            principal: usuario(),
            clientId: "beta",
          })
        );
      },
      grade: refusedWith("não são compartilhados entre clientes"),
    }),
    caso({
      id: "EV-01.18",
      description:
        "sem o rótulo de acesso, a resposta não revela que o documento existe",
      requirement: "rag R7, R11",
      run: () => {
        const kb = baseCom(doc({ accessLabels: ["diretoria"] }));
        const r = kb.retrieve({
          question: "trocas nota fiscal",
          principal: usuario({ labels: ["suporte"] }),
        });
        return {
          kind: r.kind,
          vazouTitulo:
            r.kind === "escalate"
              ? r.message.includes("Política de trocas")
              : true,
        };
      },
      grade: stateEquals({ kind: "escalate", vazouTitulo: false }),
    }),
    caso({
      id: "EV-01.19",
      description:
        "pergunta sem base na fonte escala em vez de citar o menos ruim",
      requirement: "rag R10",
      run: () => {
        const kb = baseCom(doc({}));
        const r = kb.retrieve({
          question: "qual a cor do escritorio em Lisboa",
          principal: usuario(),
        });
        return {
          kind: r.kind,
          reason: r.kind === "escalate" ? r.reason : null,
        };
      },
      grade: stateEquals({ kind: "escalate", reason: "low_confidence" }),
    }),

    // ---------- HITL (US-09) ----------
    caso({
      id: "EV-01.20",
      description:
        "ação irreversível sem aprovação não executa, e expira em 4h",
      requirement: "gateway R14, R15",
      run: async () => {
        let agora = AGORA;
        const fila = new ApprovalQueue(() => agora);
        const acao = {
          agentId: AG,
          useCaseId: FT,
          name: "emitir_nf",
          target: "ERP",
          readOnly: false,
          reversible: false,
        };
        const pedido = fila.submit(acao)!;
        let executou = false;
        const semAprovacao = await captureFailure(() =>
          fila.execute(pedido.id, async () => {
            executou = true;
            return "feito";
          })
        );
        agora = new Date(AGORA.getTime() + APPROVAL_TIMEOUT_MS + 1);
        return {
          risco: classify(acao),
          recusou: semAprovacao.refused,
          executou,
          estadoApos4h: fila.refresh(pedido.id).state,
        };
      },
      grade: stateEquals({
        risco: "irreversible",
        recusou: true,
        executou: false,
        estadoApos4h: "cancelled",
      }),
    }),
  ],
};
