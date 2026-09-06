import { describe, expect, it } from "vitest";
import { chunkDocument, type SourceDocument } from "./chunking";

const base = (over: Partial<SourceDocument>): SourceDocument => ({
  id: "doc-1",
  clientId: "acme",
  title: "Política de trocas",
  type: "text",
  accessLabels: ["todos"],
  content: "",
  ...over,
});

describe("chunkDocument — texto (R1)", () => {
  it("corta por parágrafo e preserva a ordem", () => {
    const chunks = chunkDocument(
      base({
        content: "Primeiro parágrafo.\n\nSegundo parágrafo.\n\nTerceiro.",
      })
    );
    expect(chunks.map(c => c.text)).toEqual([
      "Primeiro parágrafo.",
      "Segundo parágrafo.",
      "Terceiro.",
    ]);
    expect(chunks.map(c => c.ordinal)).toEqual([0, 1, 2]);
  });

  it("R2: cada trecho carrega a origem para reconstruir a citação", () => {
    const [chunk] = chunkDocument(base({ content: "Só um parágrafo." }));
    expect(chunk).toMatchObject({
      id: "doc-1#0",
      docId: "doc-1",
      clientId: "acme",
      title: "Política de trocas",
      accessLabels: ["todos"],
      ordinal: 0,
    });
  });
});

describe("chunkDocument — planilha", () => {
  it("uma linha por trecho, com o cabeçalho repetido em cada uma", () => {
    const chunks = chunkDocument(
      base({
        type: "spreadsheet",
        content: "produto;valor;prazo\nCadeira;1200;5 dias\nMesa;3400;10 dias",
      })
    );
    expect(chunks).toHaveLength(2);
    // Sem o cabeçalho repetido, "1200" recuperado sozinho não diz o que é.
    expect(chunks[0].text).toBe(
      "produto: Cadeira · valor: 1200 · prazo: 5 dias"
    );
    expect(chunks[1].text).toBe("produto: Mesa · valor: 3400 · prazo: 10 dias");
  });

  it("planilha só com cabeçalho não gera trecho de dado", () => {
    const chunks = chunkDocument(
      base({ type: "spreadsheet", content: "produto;valor" })
    );
    expect(chunks).toHaveLength(1);
  });

  it("célula faltando não desloca as colunas", () => {
    const [chunk] = chunkDocument(
      base({ type: "spreadsheet", content: "a;b;c\n1;2" })
    );
    expect(chunk.text).toBe("a: 1 · b: 2 · c: ");
  });
});

describe("chunkDocument — ticket", () => {
  it("uma mensagem por trecho", () => {
    const chunks = chunkDocument(
      base({
        type: "ticket",
        content:
          "[cliente] Meu pedido não chegou.\n[atendente] Vou verificar.\n[cliente] Obrigado.",
      })
    );
    expect(chunks).toHaveLength(3);
    expect(chunks[1].text).toBe("[atendente] Vou verificar.");
  });

  it("aceita o formato autor: mensagem", () => {
    const chunks = chunkDocument(
      base({
        type: "ticket",
        content: "Ana: bom dia\nSuporte: bom dia, como ajudo?",
      })
    );
    expect(chunks).toHaveLength(2);
  });
});
