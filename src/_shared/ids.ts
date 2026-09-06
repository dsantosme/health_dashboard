/**
 * Identificadores do plano ORBE (docs/plan/plan.yaml).
 *
 * Os IDs são a linguagem comum entre humanos e agentes (ST-03). Tipá-los aqui
 * faz o compilador reclamar de um ID malformado antes de `pnpm orbe:validate`
 * reclamar de um ID inexistente.
 */

/** Agente interno: AG-00..AG-10. */
export type AgentId = `AG-${string}`;
/** Template de agente para cliente: AT-01..AT-05. */
export type AgentTemplateId = `AT-${string}`;
/** Feature do backlog: FT-04.1, FT-05.2... */
export type FeatureId = `FT-${string}`;
/** Funcionalidade de módulo: F-01.1, F-03.2... */
export type ModuleFeatureId = `F-${string}`;
/** Suíte de evals: EV-01..EV-08. */
export type EvalSuiteId = `EV-${string}`;
/** Caso de uso de um pod — o par (agente, caso de uso) é a chave de custo. */
export type UseCaseId = FeatureId | AgentTemplateId;

/**
 * Classes de risco de ST-04. A ordem importa: `irreversible` exige aprovação
 * síncrona, `write` aprovação assíncrona em lote, `read` só auditoria.
 */
export const RISK_CLASSES = ["read", "write", "irreversible"] as const;
export type RiskClass = (typeof RISK_CLASSES)[number];

/** Identificação obrigatória de toda chamada — custo sem dono é custo invisível (P-06). */
export interface Attribution {
  /** Agente que originou a chamada. */
  agentId: AgentId | AgentTemplateId;
  /** Caso de uso/feature a que a chamada pertence. */
  useCaseId: UseCaseId;
  /** Cliente, quando a chamada roda dentro de um pod. */
  clientId?: string;
}
