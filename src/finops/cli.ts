/**
 * MOD-06 — CLI de custo. `pnpm cost` mostra o custo por agente e caso de uso do
 * dia (F-06.1, US-12).
 *
 * Lê os lançamentos de `.orbe/cost-ledger.jsonl` (uma entrada por linha). Esse
 * arquivo é o adapter de persistência mais simples que existe; o adapter real,
 * conciliado com o billing do provedor, é a tarefa T12 de EP-04. Enquanto ele
 * não existe, este comando é honesto sobre o que não sabe.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { InMemoryCostLedger, type LedgerConfig } from "./domain/ledger";
import type { CostEntry } from "./ports/CostLedger";

const LEDGER_FILE = resolve(process.cwd(), ".orbe", "cost-ledger.jsonl");
const PRICING_FILE = resolve(process.cwd(), ".orbe", "pricing.json");

function carregarConfig(): LedgerConfig {
  if (!existsSync(PRICING_FILE)) return { pricing: {}, dailyBudget: {} };
  return JSON.parse(readFileSync(PRICING_FILE, "utf8")) as LedgerConfig;
}

function carregarLancamentos(): CostEntry[] {
  if (!existsSync(LEDGER_FILE)) return [];
  return readFileSync(LEDGER_FILE, "utf8")
    .split("\n")
    .filter(l => l.trim().length > 0)
    .map((linha, i) => {
      try {
        const raw = JSON.parse(linha) as CostEntry & { at: string };
        return { ...raw, at: new Date(raw.at) };
      } catch {
        throw new Error(`Linha ${i + 1} de ${LEDGER_FILE} não é JSON válido.`);
      }
    });
}

function main(): void {
  const dia = process.argv[2] ? new Date(process.argv[2]) : new Date();
  const lancamentos = carregarLancamentos();

  if (lancamentos.length === 0) {
    console.log(
      `Sem lançamentos em ${LEDGER_FILE}.\n` +
        `O gateway registra custo em memória; a persistência é a tarefa T12 de EP-04.\n` +
        `Até lá, escreva os lançamentos nesse arquivo (um JSON por linha) para ver o relatório.`
    );
    return;
  }

  const ledger = new InMemoryCostLedger(carregarConfig());
  for (const entry of lancamentos) ledger.record(entry);

  const linhas = ledger.report(dia);
  if (linhas.length === 0) {
    console.log(`Nenhum lançamento em ${dia.toISOString().slice(0, 10)}.`);
    return;
  }

  console.log(
    `Custo por agente e caso de uso — ${dia.toISOString().slice(0, 10)}\n`
  );
  console.log(
    ["agente", "caso de uso", "chamadas", "ok", "custo (R$)", "custo/resultado"]
      .map((c, i) => c.padEnd([10, 14, 9, 4, 11, 15][i]))
      .join("")
  );
  let total = 0;
  for (const linha of linhas) {
    total += linha.totalCost;
    const porResultado = Number.isFinite(linha.costPerResult)
      ? linha.costPerResult.toFixed(4)
      : "— (0 resultados)";
    console.log(
      String(linha.agentId).padEnd(10) +
        String(linha.useCaseId).padEnd(14) +
        String(linha.calls).padEnd(9) +
        String(linha.successes).padEnd(4) +
        linha.totalCost.toFixed(4).padEnd(11) +
        porResultado
    );
  }
  console.log(`\ntotal do dia: R$ ${total.toFixed(2)}`);
  console.log(
    "Estouro de orçamento alerta por HK-08 e bloqueia merge até revisão (PR-10)."
  );
}

main();
