/**
 * MOD-05 — CLI de evals. `pnpm evals` roda tudo; `pnpm evals -- EV-01` roda uma.
 *
 * Sai com código 1 quando alguma suíte fica abaixo do limiar: é o gate que
 * bloqueia deploy (HK-04, US-11). O limiar vem de docs/plan/plan.yaml, nunca
 * daqui.
 */
import { formatSuiteResult, runSuite, type EvalSuite } from "./domain/runner";
import { EV_01 } from "./suites/ev-01";

const SUITES: EvalSuite[] = [EV_01];

async function main(): Promise<void> {
  const pedidas = process.argv.slice(2).map(a => a.toUpperCase());
  const alvo =
    pedidas.length > 0 ? SUITES.filter(s => pedidas.includes(s.id)) : SUITES;

  if (alvo.length === 0) {
    console.error(
      `Nenhuma suíte corresponde a ${pedidas.join(", ")}. ` +
        `Disponíveis: ${SUITES.map(s => s.id).join(", ")}.`
    );
    process.exit(1);
  }

  let bloqueou = false;
  for (const suite of alvo) {
    const resultado = await runSuite(suite);
    console.log(formatSuiteResult(resultado));
    console.log("");
    if (!resultado.meetsThreshold) bloqueou = true;
  }

  if (bloqueou) {
    console.error(
      "Pass rate abaixo do limiar. Não relaxe o limiar nem remova o caso: " +
        "ou o código está errado, ou a spec muda primeiro, com aprovação humana (P-02, P-03)."
    );
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
