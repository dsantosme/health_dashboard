/**
 * MOD-06 — livro-razão de custo em memória (F-06.1).
 *
 * Satisfaz R6 e R8 de `.kiro/specs/gateway/requirements.md` e US-12.
 *
 * Em memória de propósito: é o adapter que deixa os evals rodarem em CI sem
 * nuvem (ADR-0001). O adapter persistente é a tarefa T12 de EP-04.
 */
import type {
  BudgetVerdict,
  CostEntry,
  CostLedger,
  CostReportRow,
} from "../ports/CostLedger";

/** Preço por milhão de tokens, em BRL. Sem tabela, não há atribuição de custo. */
export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

export interface LedgerConfig {
  pricing: Record<string, ModelPricing>;
  /** Teto diário por agente, em BRL. Agente sem teto declarado não chama (P-06). */
  dailyBudget: Record<string, number>;
}

/** Dia no fuso do relatório. Chave de agregação do orçamento diário. */
const dayKey = (at: Date): string => at.toISOString().slice(0, 10);

export function priceOf(
  pricing: Record<string, ModelPricing>,
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const table = pricing[model];
  if (!table) {
    throw new Error(
      `Sem preço para o modelo "${model}". Adicione-o à tabela de preços antes de roteá-lo — ` +
        `chamada sem custo conhecido não pode ir a produção (P-06).`
    );
  }
  const cost =
    (inputTokens / 1_000_000) * table.inputPerMillion +
    (outputTokens / 1_000_000) * table.outputPerMillion;
  // Arredonda em centavos de centavo: o custo por chamada é pequeno demais para
  // arredondar em centavos sem perder a soma do dia.
  return Math.round(cost * 10_000) / 10_000;
}

export class InMemoryCostLedger implements CostLedger {
  private readonly entries: CostEntry[] = [];

  constructor(private readonly config: LedgerConfig) {}

  record(entry: CostEntry): void {
    this.entries.push(entry);
  }

  /** Conveniência: calcula o valor pela tabela e registra (R6). */
  recordUsage(entry: Omit<CostEntry, "amount">): CostEntry {
    const amount = priceOf(
      this.config.pricing,
      entry.model,
      entry.inputTokens,
      entry.outputTokens
    );
    const full: CostEntry = { ...entry, amount };
    this.record(full);
    return full;
  }

  checkBudget(agentId: string, at: Date): BudgetVerdict {
    const limit = this.config.dailyBudget[agentId];
    if (limit === undefined) {
      return {
        allowed: false,
        spentToday: 0,
        limit: 0,
        reason:
          `Agente ${agentId} não tem orçamento diário declarado. ` +
          `Declare o teto em ST-05 antes da primeira chamada (P-06).`,
      };
    }
    const today = dayKey(at);
    const spentToday = this.entries
      .filter(e => e.agentId === agentId && dayKey(e.at) === today)
      .reduce((sum, e) => sum + e.amount, 0);

    if (spentToday >= limit) {
      return {
        allowed: false,
        spentToday,
        limit,
        reason:
          `Orçamento diário de ${agentId} estourado: R$ ${spentToday.toFixed(2)} de R$ ${limit.toFixed(2)}. ` +
          `Revise o roteamento ou aprove um teto maior (HK-08, PR-10).`,
      };
    }
    return { allowed: true, spentToday, limit };
  }

  report(at: Date): CostReportRow[] {
    const today = dayKey(at);
    const rows = new Map<string, CostReportRow>();
    for (const entry of this.entries) {
      if (dayKey(entry.at) !== today) continue;
      const key = `${entry.agentId}|${entry.useCaseId}|${entry.clientId ?? ""}`;
      const row = rows.get(key) ?? {
        agentId: entry.agentId,
        useCaseId: entry.useCaseId,
        clientId: entry.clientId,
        calls: 0,
        successes: 0,
        totalCost: 0,
        costPerResult: 0,
      };
      row.calls += 1;
      if (entry.succeeded) row.successes += 1;
      row.totalCost =
        Math.round((row.totalCost + entry.amount) * 10_000) / 10_000;
      rows.set(key, row);
    }
    for (const row of rows.values()) {
      // Sem resultado bem-sucedido, o custo por resultado é infinito, não zero —
      // e é isso que o painel precisa mostrar (US-12).
      row.costPerResult =
        row.successes === 0
          ? Number.POSITIVE_INFINITY
          : Math.round((row.totalCost / row.successes) * 10_000) / 10_000;
    }
    return [...rows.values()].sort((a, b) => b.totalCost - a.totalCost);
  }
}
