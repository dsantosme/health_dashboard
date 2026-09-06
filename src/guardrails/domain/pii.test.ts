import { describe, expect, it } from "vitest";
import {
  detectPii,
  isCnpj,
  isCpf,
  isLuhn,
  isPhone,
  maskPii,
  unmaskPii,
} from "./pii";

// CPFs e CNPJs sintéticos, gerados só para teste: nenhum dado real entra em
// fixture (ST-04).
const CPF = "529.982.247-25";
const CPF_PLAIN = "52998224725";
const CNPJ = "11.222.333/0001-81";
const CARD = "4111 1111 1111 1111";

describe("validadores (R13)", () => {
  it("aceita CPF com dígito verificador correto", () => {
    expect(isCpf(CPF)).toBe(true);
    expect(isCpf(CPF_PLAIN)).toBe(true);
  });

  it("rejeita 11 dígitos que não são CPF — código interno do cliente não é PII", () => {
    expect(isCpf("12345678901")).toBe(false);
    expect(isCpf("111.111.111-11")).toBe(false);
  });

  it("aceita e rejeita CNPJ pelo dígito verificador", () => {
    expect(isCnpj(CNPJ)).toBe(true);
    expect(isCnpj("11.222.333/0001-99")).toBe(false);
  });

  it("separa cartão de sequência longa qualquer por Luhn", () => {
    expect(isLuhn(CARD)).toBe(true);
    expect(isLuhn("4111111111111112")).toBe(false);
  });

  it("aceita telefone com e sem DDI, e rejeita DDD inexistente", () => {
    expect(isPhone("(11) 98765-4321")).toBe(true);
    expect(isPhone("+55 11 3456-7890")).toBe(true);
    expect(isPhone("(01) 98765-4321")).toBe(false);
    // 23 e 26 não são DDD em uso; um código do cliente que comece assim não é PII.
    expect(isPhone("2345678901")).toBe(false);
  });
});

describe("detectPii", () => {
  it("encontra os tipos brasileiros em texto corrido", () => {
    const texto = `Cliente ${CPF}, empresa ${CNPJ}, fale com ana@exemplo.com.br ou (11) 98765-4321, CEP 01310-100.`;
    const tipos = detectPii(texto).map(m => m.type);
    expect(tipos).toEqual(
      expect.arrayContaining(["CPF", "CNPJ", "EMAIL", "TELEFONE", "CEP"])
    );
  });

  it("não marca 11 dígitos inválidos como CPF (R13)", () => {
    const achados = detectPii("Pedido 12345678901 aprovado");
    expect(achados.filter(m => m.type === "CPF")).toHaveLength(0);
  });

  it("prefere o padrão mais longo quando dois se sobrepõem", () => {
    // O CNPJ contém sequências que também casariam como CPF.
    const achados = detectPii(`CNPJ ${CNPJ}`);
    expect(achados).toHaveLength(1);
    expect(achados[0].type).toBe("CNPJ");
  });

  it("regressão EV-01.15: não casa telefone no meio de um número maior", () => {
    // Encontrado por EV-01 antes de existir este teste: sem a barreira de
    // dígito, "12345678901" casava a partir do segundo dígito e o mascaramento
    // corrompia um código interno do cliente (P-03: falha vira caso).
    expect(detectPii("Pedido 12345678901 aprovado")).toHaveLength(0);
    expect(maskPii("Pedido 12345678901 aprovado").masked).toBe(
      "Pedido 12345678901 aprovado"
    );
  });

  it("continua encontrando telefone de verdade ao lado de outros números", () => {
    const achados = detectPii("Pedido 4837 · contato (11) 98765-4321");
    expect(achados.map(m => m.type)).toEqual(["TELEFONE"]);
  });

  it("não confunde CEP com número de produto de oito dígitos", () => {
    expect(
      detectPii("produto 01310100 em estoque").filter(m => m.type === "CEP")
    ).toHaveLength(0);
    expect(
      detectPii("CEP 01310-100").filter(m => m.type === "CEP")
    ).toHaveLength(1);
  });
});

describe("maskPii (R9, R10)", () => {
  it("substitui por marcador e não deixa o valor no texto", () => {
    const { masked, counts } = maskPii(`O CPF é ${CPF}.`);
    expect(masked).toBe("O CPF é «CPF_1».");
    expect(masked).not.toContain(CPF);
    expect(counts.CPF).toBe(1);
  });

  it("R10: o mesmo valor recebe o mesmo marcador, preservando correferência", () => {
    const { masked, tokens } = maskPii(
      `${CPF} pediu; confirme ${CPF} na nota.`
    );
    expect(masked).toBe("«CPF_1» pediu; confirme «CPF_1» na nota.");
    expect(tokens.size).toBe(1);
  });

  it("valores diferentes do mesmo tipo recebem marcadores diferentes", () => {
    const { masked, tokens } = maskPii("ana@x.com e bruno@y.com");
    expect(masked).toBe("«EMAIL_1» e «EMAIL_2»");
    expect(tokens.size).toBe(2);
  });

  it("o marcador não carrega o valor — é o que permite logar a contagem", () => {
    const { tokens, counts } = maskPii(`${CPF} e ${CARD}`);
    for (const marcador of tokens.keys()) {
      expect(marcador).not.toMatch(/\d{4,}/);
    }
    expect(counts).toEqual({ CPF: 1, CARTAO: 1 });
  });

  it("texto sem PII passa intacto", () => {
    const texto = "Pedido 42 entregue na segunda.";
    expect(maskPii(texto).masked).toBe(texto);
  });
});

describe("unmaskPii (R11)", () => {
  it("restaura os marcadores emitidos nesta chamada", () => {
    const { masked, tokens } = maskPii(`Contato: ${CPF} / ana@x.com`);
    expect(unmaskPii(masked, tokens)).toBe(`Contato: ${CPF} / ana@x.com`);
  });

  it("deixa intacto o marcador que o modelo inventou — ele é evidência", () => {
    const { tokens } = maskPii("ana@x.com");
    expect(unmaskPii("veja «CPF_9»", tokens)).toBe("veja «CPF_9»");
  });
});
