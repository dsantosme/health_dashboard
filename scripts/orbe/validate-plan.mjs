#!/usr/bin/env node
/**
 * ORBE — validador do plano (fonte de verdade: docs/plan/plan.yaml).
 *
 * Aplica P-02 ("spec é a fonte da verdade") e a regra "nunca invente IDs":
 *   1. Todo ID definido em plan.yaml é único.
 *   2. Todo ID citado em CLAUDE.md, .kiro/**, .claude/**, docs/**, src/**
 *      existe em plan.yaml ou está em docs/plan/proposed.yaml.
 *   3. proposed.yaml não colide com plan.yaml.
 *   4. CLAUDE.md tem no máximo 150 linhas (US-01).
 *
 * Sem dependências: roda em hook, em CI e em máquina sem `pnpm install`.
 * Uso: node scripts/orbe/validate-plan.mjs [--json]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const PLAN = "docs/plan/plan.yaml";
const PROPOSED = "docs/plan/proposed.yaml";
const CLAUDE_MD = "CLAUDE.md";
const CLAUDE_MD_MAX_LINES = 150;

/** Prefixos de ID, ordenados do mais longo para o mais curto (a alternância é gulosa). */
const ID_PREFIXES = [
  "KPI",
  "MOD",
  "PR",
  "AT",
  "AG",
  "SK",
  "ST",
  "HK",
  "HR",
  "EV",
  "EP",
  "FT",
  "US",
  "F",
  "P",
];
const ID_RE = new RegExp(
  `\\b(${ID_PREFIXES.join("|")})-(\\d+(?:\\.\\d+)*)`,
  "g"
);
const HORIZON_RE = /\bH(30|60|90|180|365)\b/g;
/** Definição em plan.yaml: `- id: X`, `  - { id: X, ...}` ou `  id: X`. */
const DEF_RE = /^\s*(?:-\s*)?\{?\s*id:\s*([A-Z]+-[\d.]+)/;

const SCAN_DIRS = [".kiro", ".claude", "docs", "src", "clients"];
const SCAN_FILES = [CLAUDE_MD, "progress.md", PLAN];
const SCAN_EXT = new Set([".md", ".yaml", ".yml", ".ts", ".json"]);
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "references",
]);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.has(entry.slice(entry.lastIndexOf(".")))) out.push(full);
  }
  return out;
}

function matchIds(text) {
  const ids = [];
  for (const m of text.matchAll(ID_RE))
    ids.push({ id: `${m[1]}-${m[2]}`, index: m.index });
  for (const m of text.matchAll(HORIZON_RE))
    ids.push({ id: `H${m[1]}`, index: m.index });
  return ids;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

const errors = [];
const warnings = [];

// --- 1. Definições ---------------------------------------------------------
if (!existsSync(PLAN)) {
  console.error(
    `ORBE: ${PLAN} não encontrado. Ele é a fonte de verdade do projeto.`
  );
  process.exit(1);
}
const planText = readFileSync(PLAN, "utf8");
const defined = new Map(); // id -> primeira linha
planText.split("\n").forEach((line, i) => {
  const m = DEF_RE.exec(line);
  if (!m) return;
  const id = m[1];
  if (defined.has(id)) {
    errors.push(
      `${PLAN}:${i + 1} ID duplicado ${id} (já definido na linha ${defined.get(id)}).`
    );
    return;
  }
  defined.set(id, i + 1);
});
// Horizontes usam `- id: H30`, capturados acima? Não: não têm dígito após hífen.
for (const m of planText.matchAll(
  /^\s*-\s*id:\s*(H(?:30|60|90|180|365))\s*$/gm
)) {
  defined.set(m[1], lineOf(planText, m.index));
}

// --- 2. Propostos ----------------------------------------------------------
const proposed = new Set();
if (existsSync(PROPOSED)) {
  const proposedText = readFileSync(PROPOSED, "utf8");
  for (const line of proposedText.split("\n")) {
    const m = DEF_RE.exec(line);
    if (!m) continue;
    if (defined.has(m[1])) {
      errors.push(
        `${PROPOSED}: ${m[1]} já existe em ${PLAN}; remova a proposta ou escolha outro ID.`
      );
    }
    proposed.add(m[1]);
  }
}

// --- 3. Referências --------------------------------------------------------
/**
 * Casos de eval (`EV-01.07`) são sub-IDs de uma suíte definida no plano, mas
 * vivem no código da suíte — é lá que se sabe quantos casos existem. Só EV tem
 * essa liberdade: um `FT-04.9` inventado continua sendo erro, porque feature é
 * decisão de backlog e precisa de aprovação humana.
 */
const isEvalCase = id => {
  const m = /^(EV-\d+)\.\d+$/.exec(id);
  return m !== null && defined.has(m[1]);
};

const files = [
  ...SCAN_FILES.filter(existsSync),
  ...SCAN_DIRS.flatMap(d => walk(d)),
];
const unknown = new Map(); // id -> [ "arquivo:linha" ]
for (const file of new Set(
  files.map(f => relative(ROOT, f).split(sep).join("/"))
)) {
  const text = readFileSync(file, "utf8");
  for (const { id, index } of matchIds(text)) {
    if (defined.has(id) || proposed.has(id) || isEvalCase(id)) continue;
    if (!unknown.has(id)) unknown.set(id, []);
    unknown.get(id).push(`${file}:${lineOf(text, index)}`);
  }
}
for (const [id, where] of [...unknown].sort()) {
  errors.push(
    `ID desconhecido ${id} em ${where.slice(0, 3).join(", ")}${where.length > 3 ? ` (+${where.length - 3})` : ""}` +
      ` — defina em ${PLAN} ou proponha em ${PROPOSED}.`
  );
}

// --- 4. CLAUDE.md ≤ 150 linhas (US-01) -------------------------------------
if (existsSync(CLAUDE_MD)) {
  const lines = readFileSync(CLAUDE_MD, "utf8")
    .replace(/\n$/, "")
    .split("\n").length;
  if (lines > CLAUDE_MD_MAX_LINES) {
    errors.push(
      `${CLAUDE_MD} tem ${lines} linhas (máximo ${CLAUDE_MD_MAX_LINES}, US-01). Mova detalhe para .kiro/steering/.`
    );
  }
} else {
  warnings.push(`${CLAUDE_MD} não encontrado (FT-02.1).`);
}

// --- Saída -----------------------------------------------------------------
const byPrefix = {};
for (const id of defined.keys()) {
  const p = id.includes("-") ? id.split("-")[0] : "H";
  byPrefix[p] = (byPrefix[p] ?? 0) + 1;
}

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify(
      {
        defined: [...defined.keys()],
        proposed: [...proposed],
        errors,
        warnings,
      },
      null,
      2
    )
  );
} else {
  const summary = Object.entries(byPrefix)
    .sort()
    .map(([p, n]) => `${p}:${n}`)
    .join(" ");
  console.log(
    `ORBE plano: ${defined.size} IDs definidos (${summary}); ${files.length} arquivos verificados.`
  );
  for (const w of warnings) console.warn(`aviso: ${w}`);
  for (const e of errors) console.error(`erro: ${e}`);
}
process.exit(errors.length > 0 ? 1 : 0);
