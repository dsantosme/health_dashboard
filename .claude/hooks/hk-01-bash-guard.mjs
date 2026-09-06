#!/usr/bin/env node
/**
 * HK-01 — PreToolUse (Bash): bloqueia comandos destrutivos e escrita fora do repositório.
 *
 * "Hooks garantem, prompts pedem" (P-05): o que precisa acontecer sempre é gate,
 * não instrução. Satisfaz US-02.
 *
 * Protocolo: recebe o evento em JSON no stdin; sai com 2 para bloquear
 * (o stderr volta para o agente como motivo). Qualquer outro erro sai 0 —
 * um hook quebrado nunca deve travar a sessão.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

/** Cada regra: [nome, padrão, como proceder]. */
const RULES = [
  [
    "remoção recursiva de raiz ou home",
    /\brm\s+(-[a-zA-Z]*\s+)*-?[a-zA-Z]*[rR][a-zA-Z]*f?[a-zA-Z]*\s+(\/|~|\$HOME)(\s|$)/,
    "Apague caminhos específicos dentro do repositório.",
  ],
  [
    "reescrita de histórico remoto",
    /\bgit\s+push\b[^\n]*(--force(?!-with-lease)|-f\b)/,
    "Use --force-with-lease e só na sua própria branch.",
  ],
  [
    "descarte de trabalho local",
    /\bgit\s+(reset\s+--hard|clean\s+-[a-zA-Z]*f)/,
    "Confirme com o humano antes de descartar alterações (ST-04: ação irreversível).",
  ],
  [
    "escrita direta em dispositivo",
    /\b(dd\s+[^\n]*\bof=|mkfs(\.|\s)|>\s*\/dev\/(sd|nvme|disk))/,
    "Ação irreversível fora de escopo de qualquer tarefa.",
  ],
  [
    "execução de script remoto",
    /\b(curl|wget)\b[^\n|]*\|\s*(sudo\s+)?(ba)?sh\b/,
    "Baixe, leia o script e só então execute.",
  ],
  [
    "permissão irrestrita",
    /\bchmod\s+(-[a-zA-Z]+\s+)*777\b/,
    "Conceda o menor escopo necessário (HR-03).",
  ],
  ["fork bomb", /:\(\)\s*\{.*\|.*&.*\}\s*;/, "Não."],
  [
    "segredo em linha de comando",
    /\b(AWS_SECRET_ACCESS_KEY|ANTHROPIC_API_KEY|OPENAI_API_KEY)\s*=\s*['"]?[A-Za-z0-9/+_-]{16,}/,
    "Segredos só em cofre, nunca em comando, log ou prompt (ST-04).",
  ],
];

/**
 * Redirecionamento para caminho absoluto fora do repositório.
 * O `>` precisa vir depois de espaço (ou de um descritor de arquivo depois de
 * espaço); sem isso, um `<placeholder>/caminho` em texto vira falso positivo.
 */
const REDIRECT_RE = /(?:^|\s)\d?>>?\s*("([^"]+)"|'([^']+)'|(\/[^\s;|&]+))/g;

function outsideRepo(command) {
  for (const m of command.matchAll(REDIRECT_RE)) {
    const target = m[2] ?? m[3] ?? m[4];
    if (!target?.startsWith("/")) continue;
    if (target.startsWith("/dev/") || target.startsWith("/tmp/")) continue;
    if (!resolve(target).startsWith(resolve(REPO))) return target;
  }
  return null;
}

function main() {
  let event;
  try {
    event = JSON.parse(readFileSync(0, "utf8"));
  } catch {
    process.exit(0); // sem evento legível, não há o que julgar
  }
  const command = event?.tool_input?.command;
  if (typeof command !== "string") process.exit(0);

  for (const [name, pattern, remedy] of RULES) {
    if (pattern.test(command)) {
      console.error(`HK-01 bloqueou: ${name}.\n${remedy}\nComando: ${command}`);
      process.exit(2);
    }
  }
  const target = outsideRepo(command);
  if (target) {
    console.error(
      `HK-01 bloqueou: escrita fora do repositório (${target}).\n` +
        `Escreva dentro de ${REPO} ou peça aprovação humana (ST-04).`
    );
    process.exit(2);
  }
  process.exit(0);
}

main();
