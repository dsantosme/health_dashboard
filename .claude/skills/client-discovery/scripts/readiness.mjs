#!/usr/bin/env node
/**
 * SK-11 — AI Readiness Score.
 *
 * Uso: node .claude/skills/client-discovery/scripts/readiness.mjs <discovery.json>
 *
 * Formato de entrada (todas as notas inteiras de 0 a 4):
 *   {
 *     "cliente": "acme",
 *     "notas": { "dados": 3, "processo": 2, "integracao": 4, "governanca": 1, "patrocinio": 4 },
 *     "evidencias": { "dados": "API do ERP documentada, acesso em 2 dias", ... }
 *   }
 *
 * A rubrica está em references/readiness-rubric.md. O script não inventa nota:
 * dimensão ausente é erro, porque "não perguntei" não é o mesmo que "é zero".
 */
import { readFileSync } from "node:fs";

const DIMENSOES = [
  "dados",
  "processo",
  "integracao",
  "governanca",
  "patrocinio",
];

const FAIXAS = [
  {
    min: 16,
    leitura: "Pronto",
    recomendacao: "Propor pod de 45 dias com KPI contratado.",
  },
  {
    min: 11,
    leitura: "Pronto com lacuna",
    recomendacao: "Propor pod, com a dimensão mais fraca como primeira tarefa.",
  },
  {
    min: 6,
    leitura: "Não pronto",
    recomendacao: "Vender diagnóstico pago; pod só depois da medição.",
  },
  {
    min: 0,
    leitura: "Fora do ICP hoje",
    recomendacao: "Não vender; reavaliar em um trimestre.",
  },
];

function die(msg) {
  console.error(`erro: ${msg}`);
  process.exit(1);
}

const file = process.argv[2];
if (!file)
  die("informe o arquivo de descoberta. Uso: readiness.mjs <discovery.json>");

let entrada;
try {
  entrada = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  die(`não consegui ler ${file}: ${e.message}`);
}

const notas = entrada?.notas ?? {};
const faltando = DIMENSOES.filter(d => !Number.isInteger(notas[d]));
if (faltando.length > 0) {
  die(
    `dimensões sem nota inteira: ${faltando.join(", ")}.\n` +
      `"Não perguntei" não é zero — volte ao roteiro antes de pontuar.`
  );
}
const foraDeFaixa = DIMENSOES.filter(d => notas[d] < 0 || notas[d] > 4);
if (foraDeFaixa.length > 0)
  die(`notas fora de 0–4: ${foraDeFaixa.join(", ")}.`);

const total = DIMENSOES.reduce((soma, d) => soma + notas[d], 0);
const zeros = DIMENSOES.filter(d => notas[d] === 0);
const maisFraca = DIMENSOES.reduce((a, b) => (notas[b] < notas[a] ? b : a));

let indice = FAIXAS.findIndex(f => total >= f.min);
// Um único zero costuma ser o que mata o pod no dia 40: rebaixa um nível.
if (zeros.length > 0 && indice < FAIXAS.length - 1) indice += 1;
const faixa = FAIXAS[indice];

const barra = n => "█".repeat(n) + "·".repeat(4 - n);

console.log(
  `AI Readiness Score — ${entrada.cliente ?? "(cliente sem nome)"}\n`
);
for (const d of DIMENSOES) {
  const evidencia = entrada?.evidencias?.[d];
  console.log(
    `  ${d.padEnd(11)} ${barra(notas[d])} ${notas[d]}/4${evidencia ? `  — ${evidencia}` : ""}`
  );
}
console.log(`\n  total: ${total}/20 — ${faixa.leitura}`);
if (zeros.length > 0) {
  console.log(
    `  atenção: zero em ${zeros.join(", ")} — recomendação rebaixada um nível.`
  );
}
console.log(`  dimensão mais fraca: ${maisFraca}`);
console.log(`\n  ${faixa.recomendacao}`);
console.log(
  `\nPróximo passo: registrar em clients/<slug>/discovery.md e, se for vender, rodar SK-05.`
);
