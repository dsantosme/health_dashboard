/**
 * MOD-02 — detecção e mascaramento de PII brasileira (F-02.1).
 *
 * Satisfaz R9, R10, R11 e R13 de `.kiro/specs/gateway/requirements.md`.
 *
 * Duas regras dão forma a este arquivo:
 *
 *  - **Validar antes de mascarar** (R13). Onze dígitos seguidos são um CPF ou o
 *    código interno do ERP do cliente; só o dígito verificador distingue. Sem
 *    isso, o mascaramento corrompe a entrada e o agente responde errado.
 *  - **O marcador não carrega o valor** (R9). O que vai para o log é `«CPF_1»`,
 *    nunca o CPF. O mapa marcador→valor vive em memória durante a chamada e não
 *    é persistido em lugar algum.
 */

export const PII_TYPES = [
  "CPF",
  "CNPJ",
  "CARTAO",
  "EMAIL",
  "TELEFONE",
  "CEP",
] as const;
export type PiiType = (typeof PII_TYPES)[number];

export interface PiiMatch {
  type: PiiType;
  value: string;
  start: number;
  end: number;
}

export interface MaskResult {
  /** Texto com cada ocorrência substituída pelo marcador. */
  masked: string;
  /** marcador → valor original. Nunca persista isto. */
  tokens: Map<string, string>;
  /** Quantidade por tipo — é isto que pode ir para o log de auditoria. */
  counts: Partial<Record<PiiType, number>>;
}

/** `«CPF_1»`: estável dentro da chamada, sem valor embutido. */
const MARKER_RE = /«([A-Z]+)_(\d+)»/g;
export const marker = (type: PiiType, n: number): string => `«${type}_${n}»`;

/**
 * A ordem é significativa: o padrão mais longo vence, porque um CNPJ contém
 * sequências que também parecem CPF, e um cartão contém sequências que também
 * parecem telefone.
 */
const PATTERNS: ReadonlyArray<{
  type: PiiType;
  re: RegExp;
  valid?: (raw: string) => boolean;
}> = [
  { type: "EMAIL", re: /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g },
  {
    type: "CNPJ",
    re: /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g,
    valid: isCnpj,
  },
  { type: "CPF", re: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, valid: isCpf },
  { type: "CARTAO", re: /(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)/g, valid: isLuhn },
  // O `(?<!\d)` não é decoração: sem ele, "12345678901" casa a partir do segundo
  // dígito e o mascaramento corrompe um código interno do cliente (R13).
  {
    type: "TELEFONE",
    re: /(?<![\d-])(?:\+55[\s-]?)?\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}(?!\d)/g,
    valid: isPhone,
  },
  // CEP só na forma com hífen: oito dígitos soltos são ambíguos demais para
  // mascarar sem contexto, e falso positivo aqui quebra código de produto.
  { type: "CEP", re: /\b\d{5}-\d{3}\b/g },
];

const digits = (s: string): string => s.replace(/\D/g, "");

/** Valida o dígito verificador de CPF (R13). Rejeita repetições como 111.111.111-11. */
export function isCpf(raw: string): boolean {
  const d = digits(raw);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (const [len, factor] of [
    [9, 10],
    [10, 11],
  ] as const) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (factor - i);
    const check = ((sum * 10) % 11) % 10;
    if (check !== Number(d[len])) return false;
  }
  return true;
}

/** Valida o dígito verificador de CNPJ (R13). */
export function isCnpj(raw: string): boolean {
  const d = digits(raw);
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;
  const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (const len of [12, 13]) {
    const w = weights.slice(13 - len);
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * w[i];
    const rest = sum % 11;
    const check = rest < 2 ? 0 : 11 - rest;
    if (check !== Number(d[len])) return false;
  }
  return true;
}

/** Luhn: separa cartão de qualquer outra sequência longa de dígitos. */
export function isLuhn(raw: string): boolean {
  const d = digits(raw);
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

/**
 * DDDs em uso no Brasil. A lista existe para não mascarar como telefone
 * qualquer sequência de 10–11 dígitos: "23" e "26" não são DDD, e um código
 * interno do cliente que comece assim precisa passar intacto (R13).
 */
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/** Telefone brasileiro: 10 ou 11 dígitos, DDD real; o de 11 começa com 9. */
export function isPhone(raw: string): boolean {
  const semDdi = digits(raw);
  const d =
    semDdi.length > 11 && semDdi.startsWith("55") ? semDdi.slice(2) : semDdi;
  if (d.length !== 10 && d.length !== 11) return false;
  if (!DDDS.has(Number(d.slice(0, 2)))) return false;
  if (d.length === 11 && d[2] !== "9") return false;
  // Fixo não começa com 9 nem com 0/1 no primeiro dígito do número.
  if (d.length === 10 && !/[2-8]/.test(d[2])) return false;
  return true;
}

/**
 * Encontra toda PII do texto, sem sobreposição: quando dois padrões cobrem a
 * mesma região, vence o que começa antes e, em empate, o mais longo.
 */
export function detectPii(text: string): PiiMatch[] {
  const found: PiiMatch[] = [];
  for (const { type, re, valid } of PATTERNS) {
    for (const m of text.matchAll(new RegExp(re.source, re.flags))) {
      const value = m[0];
      if (valid && !valid(value)) continue;
      found.push({
        type,
        value,
        start: m.index ?? 0,
        end: (m.index ?? 0) + value.length,
      });
    }
  }
  found.sort((a, b) => a.start - b.start || b.end - a.end);

  const kept: PiiMatch[] = [];
  let cursor = -1;
  for (const match of found) {
    if (match.start < cursor) continue; // já coberto por um padrão mais longo
    kept.push(match);
    cursor = match.end;
  }
  return kept;
}

/**
 * Substitui cada ocorrência por um marcador. O mesmo valor recebe sempre o mesmo
 * marcador dentro da chamada, para preservar a correferência (R10) — sem isso o
 * modelo perde a informação de que dois trechos falam da mesma pessoa.
 */
export function maskPii(text: string): MaskResult {
  const matches = detectPii(text);
  const tokens = new Map<string, string>();
  const byValue = new Map<string, string>();
  const counts: Partial<Record<PiiType, number>> = {};

  let out = "";
  let cursor = 0;
  for (const match of matches) {
    let token = byValue.get(match.value);
    if (token === undefined) {
      counts[match.type] = (counts[match.type] ?? 0) + 1;
      token = marker(match.type, counts[match.type] as number);
      byValue.set(match.value, token);
      tokens.set(token, match.value);
    }
    out += text.slice(cursor, match.start) + token;
    cursor = match.end;
  }
  out += text.slice(cursor);
  return { masked: out, tokens, counts };
}

/**
 * Restaura apenas os marcadores emitidos nesta chamada (R11). Um marcador que o
 * modelo inventou fica no texto de propósito — ele é evidência de alucinação, e
 * a inspeção de saída precisa vê-lo.
 */
export function unmaskPii(text: string, tokens: Map<string, string>): string {
  return text.replace(MARKER_RE, full => tokens.get(full) ?? full);
}
