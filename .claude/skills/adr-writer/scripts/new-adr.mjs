#!/usr/bin/env node
/**
 * SK-13 — cria o próximo ADR numerado em docs/adr/ a partir do template.
 * Uso: node .claude/skills/adr-writer/scripts/new-adr.mjs "Título da decisão"
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..", "..", "..");
const ADR_DIR = join(REPO, "docs", "adr");
const TEMPLATE = join(HERE, "..", "references", "adr-template.md");

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('uso: node new-adr.mjs "Título da decisão em uma linha"');
  process.exit(1);
}

mkdirSync(ADR_DIR, { recursive: true });
const used = readdirSync(ADR_DIR)
  .map(f => /^ADR-(\d{4})/.exec(f)?.[1])
  .filter(Boolean)
  .map(Number);
const next = String((used.length ? Math.max(...used) : 0) + 1).padStart(4, "0");

const slug = title
  .toLowerCase()
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 60);

const target = join(ADR_DIR, `ADR-${next}-${slug}.md`);
if (existsSync(target)) {
  console.error(`erro: ${target} já existe.`);
  process.exit(1);
}

const body = readFileSync(TEMPLATE, "utf8")
  .replace(
    "# ADR-NNNN — <decisão em uma linha, no imperativo>",
    `# ADR-${next} — ${title}`
  )
  .replace(
    "- **Data:** AAAA-MM-DD",
    `- **Data:** ${new Date().toISOString().slice(0, 10)}`
  );

writeFileSync(target, body, "utf8");
console.log(`ADR-${next} criado: ${target.replace(`${REPO}/`, "")}`);
console.log(
  "Preencha contexto, ao menos duas alternativas reais e as consequências."
);
console.log("Status fica 'proposto' até um humano aceitar (P-07, PR-08).");
