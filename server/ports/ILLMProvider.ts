/**
 * Port (Interface) for LLM Provider
 * Defines the contract for any LLM service implementation
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  finishReason?: string;
}

export interface ILLMProvider {
  /**
   * Generate completion from messages
   */
  generateCompletion(messages: LLMMessage[]): Promise<LLMResponse>;
}
