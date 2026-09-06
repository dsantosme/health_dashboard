#!/usr/bin/env node
/**
 * HK-02 — PostToolUse (Edit|Write|MultiEdit): formata o arquivo alterado e roda
 * os testes do módulo afetado. Satisfaz a segunda condição de US-02.
 *
 * Degrada com elegância: se as dependências não estiverem instaladas, avisa e
 * sai 0. Falha de teste sai 2 para que o agente veja o erro e conserte antes
 * de seguir.
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { relative, dirname, basename, extname, join } from "node:path";

const REPO = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const FORMATTABLE = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".md",
  ".yaml",
  ".yml",
  ".css",
]);

function run(cmd, args) {
  return spawnSync(cmd, args, {
    cwd: REPO,
    encoding: "utf8",
    timeout: 120_000,
  });
}

function main() {
  let event;
  try {
    event = JSON.parse(readFileSync(0, "utf8"));
  } catch {
    process.exit(0);
  }
  const filePath = event?.tool_input?.file_path;
  if (typeof filePath !== "string") process.exit(0);

  const rel = relative(REPO, filePath);
  if (rel.startsWith("..") || rel.includes("node_modules")) process.exit(0);
  if (!existsSync(filePath)) process.exit(0);

  const notes = [];

  if (FORMATTABLE.has(extname(filePath))) {
    if (existsSync(join(REPO, "node_modules", ".bin", "prettier"))) {
      const fmt = run("node_modules/.bin/prettier", ["--write", rel]);
      if (fmt.status !== 0)
        notes.push(`prettier falhou em ${rel}: ${(fmt.stderr ?? "").trim()}`);
    } else {
      notes.push(
        "prettier ausente (rode `pnpm install`); formatação não verificada."
      );
    }
  }

  // Testes do módulo alterado: o próprio arquivo se for teste, senão o irmão *.test.ts.
  if (/\.tsx?$/.test(filePath) && !rel.startsWith("docs/")) {
    const sibling = join(
      dirname(filePath),
      `${basename(filePath).replace(/\.tsx?$/, "")}.test.ts`
    );
    const target = /\.(test|spec)\.tsx?$/.test(filePath) ? filePath : sibling;
    if (
      existsSync(target) &&
      existsSync(join(REPO, "node_modules", "vitest"))
    ) {
      const test = run("node_modules/.bin/vitest", [
        "run",
        relative(REPO, target),
      ]);
      if (test.status !== 0) {
        console.error(
          `HK-02: testes de ${relative(REPO, target)} falharam.\n` +
            `${(test.stdout ?? "").slice(-3000)}${(test.stderr ?? "").slice(-1000)}`
        );
        process.exit(2);
      }
    } else if (!existsSync(target) && !/\.(test|spec)\.tsx?$/.test(filePath)) {
      notes.push(
        `sem teste para ${rel} — P-03 exige evidência antes de concluir a tarefa.`
      );
    }
  }

  // IDs do plano: barato o bastante para rodar a cada edição de doc/spec.
  if (/\.(md|ya?ml)$/.test(filePath)) {
    const validate = run("node", ["scripts/orbe/validate-plan.mjs"]);
    if (validate.status !== 0) {
      console.error(
        `HK-02: validação do plano falhou.\n${validate.stdout}${validate.stderr}`
      );
      process.exit(2);
    }
  }

  if (notes.length > 0) console.error(`HK-02: ${notes.join(" | ")}`);
  process.exit(0);
}

main();
