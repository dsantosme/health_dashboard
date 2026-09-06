/**
 * MOD-03 — chunking por tipo de documento (F-03.1, FT-05.1).
 *
 * Satisfaz R1 e R2 de `.kiro/specs/knowledge-rag/requirements.md`.
 *
 * O tipo do documento decide o corte porque a unidade de sentido é diferente em
 * cada um: um parágrafo em texto corrido, uma linha em planilha, uma mensagem em
 * ticket. Cortar planilha por parágrafo perde o cabeçalho e produz trecho que
 * não significa nada fora da tabela.
 */

export type DocumentType = "text" | "spreadsheet" | "ticket";

export interface SourceDocument {
  id: string;
  clientId: string;
  title: string;
  type: DocumentType;
  /** Rótulos que o consultante precisa ter para ver este documento (R7). */
  accessLabels: string[];
  content: string;
}

export interface Chunk {
  id: string;
  docId: string;
  clientId: string;
  title: string;
  accessLabels: string[];
  /** Posição no documento — é o que permite reconstruir a citação (R2). */
  ordinal: number;
  text: string;
}

/** Texto corrido: parágrafo é a unidade de sentido. */
function chunkText(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
}

/**
 * Planilha: uma linha por trecho, com o cabeçalho repetido. Sem repetir o
 * cabeçalho, "1200" recuperado sozinho não diz se é valor, peso ou quantidade.
 */
function chunkSpreadsheet(content: string): string[] {
  const linhas = content
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);
  if (linhas.length <= 1) return linhas;

  const [cabecalho, ...corpo] = linhas;
  const colunas = cabecalho.split(/\s*[;,\t|]\s*/);
  return corpo.map(linha => {
    const valores = linha.split(/\s*[;,\t|]\s*/);
    return colunas
      .map((coluna, i) => `${coluna}: ${valores[i] ?? ""}`)
      .join(" · ");
  });
}

/**
 * Ticket: uma mensagem por trecho. O separador é uma linha que começa com
 * `[autor]` ou `autor:` — formato comum em exportação de helpdesk.
 */
function chunkTicket(content: string): string[] {
  const partes = content.split(/\n(?=\[[^\]\n]+\]|[\w .-]{1,40}:\s)/);
  return partes.map(p => p.trim()).filter(Boolean);
}

const STRATEGIES: Record<DocumentType, (content: string) => string[]> = {
  text: chunkText,
  spreadsheet: chunkSpreadsheet,
  ticket: chunkTicket,
};

/**
 * Divide o documento preservando a ordem original (R1) e carregando a origem em
 * cada trecho (R2). O `clientId` e os rótulos descem para o trecho porque a ACL
 * é decidida na recuperação, sobre o trecho, não sobre o documento.
 */
export function chunkDocument(doc: SourceDocument): Chunk[] {
  const partes = STRATEGIES[doc.type](doc.content);
  return partes.map((text, index) => ({
    id: `${doc.id}#${index}`,
    docId: doc.id,
    clientId: doc.clientId,
    title: doc.title,
    accessLabels: doc.accessLabels,
    ordinal: index,
    text,
  }));
}
