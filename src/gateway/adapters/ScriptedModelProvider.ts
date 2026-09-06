/**
 * MOD-01 — provedor roteirizado, em memória (ADR-0001).
 *
 * Existe para que os evals rodem em CI sem nuvem e sem credencial (P-03): a
 * suíte EV-01 precisa passar em cada PR, e um teste que depende de rede não
 * passa em cada PR. O adapter Bedrock é a tarefa T11 de EP-04.
 */
import type {
  CompletionRequest,
  CompletionResult,
  ModelProvider,
} from "../ports/ModelProvider";

export type ScriptedBehavior =
  | { kind: "reply"; content: string; latencyMs?: number }
  | { kind: "fail"; message: string };

export class ScriptedModelProvider implements ModelProvider {
  /** Requisições recebidas, na ordem — é aqui que o teste verifica o que saiu. */
  readonly seen: CompletionRequest[] = [];

  constructor(private readonly script: Record<string, ScriptedBehavior>) {}

  async complete(request: CompletionRequest): Promise<CompletionResult> {
    this.seen.push(request);
    const behavior = this.script[request.model];
    if (!behavior) {
      throw new Error(`Modelo ${request.model} não está no roteiro do teste.`);
    }
    if (behavior.kind === "fail") throw new Error(behavior.message);

    const inputChars = request.messages.reduce(
      (n, m) => n + m.content.length,
      0
    );
    return {
      content: behavior.content,
      inputTokens: Math.ceil(inputChars / 4),
      outputTokens: Math.ceil(behavior.content.length / 4),
      latencyMs: behavior.latencyMs ?? 100,
    };
  }
}
