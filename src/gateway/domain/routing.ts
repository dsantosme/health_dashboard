/**
 * MOD-01 — política de roteamento (F-01.1).
 *
 * Satisfaz R1, R2 e R3 de `.kiro/specs/gateway/requirements.md`.
 *
 * A política devolve uma **lista ordenada** de candidatos, não um vencedor: o
 * gateway precisa dos seguintes para o fallback (R4). Ordena pelo mais barato
 * que atende às restrições — custo é feature (P-06), mas nunca à custa de uma
 * restrição de dados (R2) ou do piso de qualidade do caso de uso.
 */
import type { ModelSpec } from "../ports/ModelProvider";

export interface RoutingConstraints {
  /** A requisição contém dado regulado (LGPD, contrato, saúde)? */
  regulated?: boolean;
  /** Latência máxima aceitável; descarta modelos mais lentos que isso. */
  maxLatencyMs?: number;
  /** Piso de qualidade do caso de uso, na mesma escala de `ModelSpec.qualityRank`. */
  minQuality?: number;
}

export class NoEligibleModelError extends Error {
  constructor(
    readonly constraints: RoutingConstraints,
    readonly rejected: Array<{ model: string; reason: string }>
  ) {
    const detalhe = rejected.map(r => `${r.model} (${r.reason})`).join("; ");
    super(
      `Nenhum modelo atende à política. Descartados: ${detalhe || "nenhum modelo registrado"}. ` +
        `Ajuste a política, adicione um modelo elegível ou relaxe a restrição — ` +
        `esta chamada não foi enviada a provedor algum.`
    );
    this.name = "NoEligibleModelError";
  }
}

export interface RoutingPolicy {
  /** Modelos elegíveis, do preferido ao último recurso (R1). */
  select(constraints: RoutingConstraints): ModelSpec[];
}

export class CostAwareRoutingPolicy implements RoutingPolicy {
  constructor(private readonly catalog: readonly ModelSpec[]) {}

  select(constraints: RoutingConstraints): ModelSpec[] {
    const rejected: Array<{ model: string; reason: string }> = [];
    const eligible: ModelSpec[] = [];

    for (const model of this.catalog) {
      // R2: dado regulado é restrição dura. Nunca é relaxada por custo.
      if (constraints.regulated && !model.allowsRegulatedData) {
        rejected.push({
          model: model.id,
          reason: "não permitido para dados regulados",
        });
        continue;
      }
      if (
        constraints.maxLatencyMs !== undefined &&
        model.p95LatencyMs > constraints.maxLatencyMs
      ) {
        rejected.push({
          model: model.id,
          reason: `p95 ${model.p95LatencyMs}ms > ${constraints.maxLatencyMs}ms`,
        });
        continue;
      }
      if (
        constraints.minQuality !== undefined &&
        model.qualityRank < constraints.minQuality
      ) {
        rejected.push({
          model: model.id,
          reason: `qualidade ${model.qualityRank} < ${constraints.minQuality}`,
        });
        continue;
      }
      eligible.push(model);
    }

    // R3: recusar antes de chamar qualquer provedor.
    if (eligible.length === 0)
      throw new NoEligibleModelError(constraints, rejected);

    // Mais barato primeiro; empate desfeito pela maior qualidade.
    return [...eligible].sort(
      (a, b) => a.costRank - b.costRank || b.qualityRank - a.qualityRank
    );
  }
}
