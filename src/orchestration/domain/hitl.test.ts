import { describe, expect, it } from "vitest";
import {
  APPROVAL_TIMEOUT_MS,
  ApprovalQueue,
  ApprovalRequiredError,
  classify,
  type Action,
} from "./hitl";
import type { AgentId, FeatureId } from "../../_shared/ids";

const AG: AgentId = "AG-07";
const FT: FeatureId = "FT-06.1";
const T0 = new Date("2026-09-06T10:00:00Z");

const acao = (over: Partial<Action> = {}): Action => ({
  agentId: AG,
  useCaseId: FT,
  name: "consultar_pedido",
  target: "ERP",
  readOnly: true,
  ...over,
});

/** Relógio controlado: sem ele, testar "expira em 4h" levaria 4 horas. */
function relogio(inicio: Date) {
  let agora = inicio;
  return {
    now: () => agora,
    avancar: (ms: number) => {
      agora = new Date(agora.getTime() + ms);
    },
  };
}

describe("classify (R14, ST-04)", () => {
  it("leitura declarada é read", () => {
    expect(classify(acao())).toBe("read");
  });

  it("escrita reversível é write", () => {
    expect(classify(acao({ readOnly: false, reversible: true }))).toBe("write");
  });

  it("escrita irreversível é irreversible", () => {
    expect(classify(acao({ readOnly: false, reversible: false }))).toBe(
      "irreversible"
    );
  });

  it("ação externa é irreversible mesmo se marcada como reversível", () => {
    // E-mail ao cliente final não volta atrás porque o sistema tem um botão.
    expect(
      classify(acao({ readOnly: false, reversible: true, external: true }))
    ).toBe("irreversible");
  });

  it("na dúvida sobe o risco: nada declarado é irreversible", () => {
    expect(
      classify({ agentId: AG, useCaseId: FT, name: "?", target: "?" })
    ).toBe("irreversible");
  });
});

describe("ApprovalQueue (R15, US-09)", () => {
  it("leitura segue sem aprovação", () => {
    const fila = new ApprovalQueue(() => T0);
    expect(fila.submit(acao())).toBeNull();
  });

  it("escrita pausa e pede aprovação com evidência do que muda", () => {
    const fila = new ApprovalQueue(() => T0);
    const pedido = fila.submit(
      acao({
        name: "emitir_nf",
        target: "ERP",
        readOnly: false,
        reversible: false,
        payload: { valor: 1250.5, cliente: "acme" },
      })
    );
    expect(pedido?.state).toBe("pending");
    expect(pedido?.risk).toBe("irreversible");
    expect(pedido?.evidence).toContain("emitir_nf");
    expect(pedido?.evidence).toContain("valor");
    expect(pedido?.evidence).toContain("1250.5");
  });

  it("o prazo de expiração é de 4 horas", () => {
    const fila = new ApprovalQueue(() => T0);
    const pedido = fila.submit(acao({ readOnly: false, reversible: true }))!;
    expect(pedido.expiresAt.getTime() - pedido.requestedAt.getTime()).toBe(
      APPROVAL_TIMEOUT_MS
    );
  });

  it("US-09: sem resposta em 4h a ação é cancelada, nunca executada", () => {
    const clock = relogio(T0);
    const fila = new ApprovalQueue(clock.now);
    const pedido = fila.submit(acao({ readOnly: false, reversible: false }))!;

    clock.avancar(APPROVAL_TIMEOUT_MS - 1000);
    expect(fila.refresh(pedido.id).state).toBe("pending");

    clock.avancar(2000);
    const expirado = fila.refresh(pedido.id);
    expect(expirado.state).toBe("cancelled");
    expect(expirado.decidedBy).toBe("timeout");
  });

  it("aprovação expirada não pode ser aprovada depois", () => {
    const clock = relogio(T0);
    const fila = new ApprovalQueue(clock.now);
    const pedido = fila.submit(acao({ readOnly: false, reversible: true }))!;
    clock.avancar(APPROVAL_TIMEOUT_MS + 1);
    expect(() => fila.approve(pedido.id, "denis")).toThrow(/está cancelled/);
  });

  it("execute recusa enquanto não houver aprovação", async () => {
    const fila = new ApprovalQueue(() => T0);
    const pedido = fila.submit(acao({ readOnly: false, reversible: false }))!;
    await expect(
      fila.execute(pedido.id, async () => "feito")
    ).rejects.toBeInstanceOf(ApprovalRequiredError);
  });

  it("execute roda depois da aprovação e marca como executada", async () => {
    const fila = new ApprovalQueue(() => T0);
    const pedido = fila.submit(acao({ readOnly: false, reversible: false }))!;
    fila.approve(pedido.id, "denis");

    await expect(fila.execute(pedido.id, async a => a.name)).resolves.toBe(
      "consultar_pedido"
    );
    expect(fila.get(pedido.id)?.state).toBe("executed");
  });

  it("ação rejeitada não executa", async () => {
    const fila = new ApprovalQueue(() => T0);
    const pedido = fila.submit(acao({ readOnly: false, reversible: true }))!;
    fila.reject(pedido.id, "denis");
    await expect(
      fila.execute(pedido.id, async () => "feito")
    ).rejects.toBeInstanceOf(ApprovalRequiredError);
  });

  it("pending() esconde as que já expiraram", () => {
    const clock = relogio(T0);
    const fila = new ApprovalQueue(clock.now);
    fila.submit(acao({ readOnly: false, reversible: true }));
    expect(fila.pending()).toHaveLength(1);
    clock.avancar(APPROVAL_TIMEOUT_MS + 1);
    expect(fila.pending()).toHaveLength(0);
  });
});
