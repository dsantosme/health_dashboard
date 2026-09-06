/**
 * MOD-06 — contrato do livro-razão de custo (ADR-0001).
 *
 * "Custo é uma feature" (P-06): toda chamada de modelo produz um lançamento,
 * inclusive a que falhou — tokens de entrada consumidos por uma tentativa que
 * errou custaram dinheiro, e ignorá-los subestima o custo por resultado (KPI-06).
 */
import type { Attribution } from "../../_shared/ids";

export interface CostEntry extends Attribution {
  /** Momento do lançamento; entra por parâmetro para o teste ser determinístico. */
  at: Date;
  model: string;
  inputTokens: number;
  outputTokens: number;
  /** Custo em BRL. */
  amount: number;
  /** `false` quando a tentativa falhou — o custo existe mesmo assim (R6). */
  succeeded: boolean;
}

export interface BudgetVerdict {
  allowed: boolean;
  /** Gasto do agente no dia da consulta. */
  spentToday: number;
  limit: number;
  reason?: string;
}

export interface CostLedger {
  /** Registra um lançamento. Nunca recebe texto — só metadados e números. */
  record(entry: CostEntry): void;
  /** Verifica o teto diário do agente antes da chamada (R8). */
  checkBudget(agentId: string, at: Date): BudgetVerdict;
  /** Custo por resultado por agente e caso de uso, para o painel (F-06.1, US-12). */
  report(at: Date): CostReportRow[];
}

export interface CostReportRow extends Attribution {
  calls: number;
  successes: number;
  totalCost: number;
  /** Custo dividido pelos resultados bem-sucedidos — o número que o CFO lê. */
  costPerResult: number;
}
