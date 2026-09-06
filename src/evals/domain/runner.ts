/**
 * MOD-05 — runner de evals com graders de estado (F-05.1, FT-07.1).
 *
 * Satisfaz US-11. "Evals são os testes" (P-03), e a regra que define o módulo:
 * **grade o estado final, não o texto da resposta.** "O agente respondeu bem"
 * não é critério; "o registro existe com status aprovado" é.
 *
 * O runner é puro e síncrono do ponto de vista do chamador: recebe casos,
 * devolve resultado. Quem persiste, quem alerta e quem bloqueia deploy são
 * outros (HK-04, HK-08).
 */
import type { EvalSuiteId } from "../../_shared/ids";

export interface GradeResult {
  passed: boolean;
  /** O que se esperava × o que aconteceu. É isto que o humano lê ao investigar. */
  detail: string;
}

/** Um grader olha o estado final produzido pelo caso e decide. */
export type Grader<S> = (state: S) => GradeResult;

export interface EvalCase<S = unknown> {
  id: string;
  /** O que este caso prova, em uma linha. */
  description: string;
  /** Requisito EARS que o caso verifica — o elo entre spec e evidência (P-02). */
  requirement: string;
  /** Executa a tarefa e devolve o **estado final**, não a resposta. */
  run: () => Promise<S> | S;
  grade: Grader<S>;
}

export interface EvalSuite {
  id: EvalSuiteId;
  target: string;
  /** Limiar vindo de docs/plan/plan.yaml — nunca inventado aqui. */
  threshold: number;
  cases: EvalCase<never>[];
}

export interface CaseResult {
  id: string;
  description: string;
  requirement: string;
  passed: boolean;
  detail: string;
  durationMs: number;
}

export interface SuiteResult {
  suiteId: EvalSuiteId;
  target: string;
  threshold: number;
  total: number;
  passed: number;
  passRate: number;
  /** `false` bloqueia deploy (HK-04, US-11). */
  meetsThreshold: boolean;
  results: CaseResult[];
}

/**
 * Estado final igual ao esperado, comparado por valor.
 *
 * O `NoInfer` faz o tipo do estado vir do caso, não do valor esperado. Sem ele,
 * `stateEquals({ kind: "escalate" })` inferiria o literal `"escalate"` e o
 * compilador passaria a exigir que o caso só pudesse produzir esse valor — o
 * grader deixaria de poder reprovar.
 */
export function stateEquals<S>(expected: NoInfer<S>): Grader<S> {
  return (state: S) => {
    const a = JSON.stringify(state);
    const b = JSON.stringify(expected);
    return {
      passed: a === b,
      detail: a === b ? `estado = ${b}` : `esperado ${b}, obtido ${a}`,
    };
  };
}

/** Estado satisfaz um predicado nomeado. Use quando a igualdade é forte demais. */
export function stateSatisfies<S>(
  name: string,
  predicate: (state: S) => boolean
): Grader<S> {
  return (state: S) => {
    const passed = predicate(state);
    return {
      passed,
      detail: passed
        ? `estado satisfaz "${name}"`
        : `estado não satisfaz "${name}": ${JSON.stringify(state)}`,
    };
  };
}

/**
 * O caso deveria ter sido recusado. Combina com `captureFailure` para provar que
 * uma ação proibida **não aconteceu** — o critério de EV-04 ("0 ações proibidas").
 */
export function refusedWith(
  fragment: string
): Grader<{ refused: boolean; message: string }> {
  return state => {
    const passed = state.refused && state.message.includes(fragment);
    return {
      passed,
      detail: passed
        ? `recusado com "${fragment}"`
        : state.refused
          ? `recusado, mas a mensagem não cita "${fragment}": ${state.message}`
          : "a ação NÃO foi recusada — ação proibida executada",
    };
  };
}

/** Executa algo que deveria falhar e transforma a falha em estado observável. */
export async function captureFailure(
  action: () => Promise<unknown>
): Promise<{ refused: boolean; message: string }> {
  try {
    await action();
    return { refused: false, message: "" };
  } catch (error) {
    return {
      refused: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function runSuite(suite: EvalSuite): Promise<SuiteResult> {
  const results: CaseResult[] = [];

  for (const evalCase of suite.cases as unknown as EvalCase<unknown>[]) {
    const started = Date.now();
    let outcome: GradeResult;
    try {
      outcome = evalCase.grade(await evalCase.run());
    } catch (error) {
      // Um caso que explode é um caso que falhou — nunca um caso ignorado.
      outcome = {
        passed: false,
        detail: `erro ao executar: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
    results.push({
      id: evalCase.id,
      description: evalCase.description,
      requirement: evalCase.requirement,
      passed: outcome.passed,
      detail: outcome.detail,
      durationMs: Date.now() - started,
    });
  }

  const passed = results.filter(r => r.passed).length;
  const passRate = results.length === 0 ? 0 : passed / results.length;

  return {
    suiteId: suite.id,
    target: suite.target,
    threshold: suite.threshold,
    total: results.length,
    passed,
    passRate,
    meetsThreshold: passRate >= suite.threshold,
    results,
  };
}

/** Relatório em texto para o CI e para o humano que investiga a regressão. */
export function formatSuiteResult(result: SuiteResult): string {
  const pct = (result.passRate * 100).toFixed(1);
  const limiar = (result.threshold * 100).toFixed(1);
  const linhas = [
    `${result.suiteId} — ${result.target}`,
    `  ${result.passed}/${result.total} casos (${pct}%), limiar ${limiar}%`,
  ];
  for (const r of result.results.filter(r => !r.passed)) {
    linhas.push(`  ✗ ${r.id} ${r.description}`);
    linhas.push(`      requisito: ${r.requirement}`);
    linhas.push(`      ${r.detail}`);
  }
  linhas.push(
    result.meetsThreshold
      ? `  gate: PASSA`
      : `  gate: BLOQUEIA deploy — pass rate abaixo do limiar (US-11, HK-04)`
  );
  return linhas.join("\n");
}
