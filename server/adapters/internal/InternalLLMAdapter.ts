/**
 * Internal LLM Adapter
 * 
 * Adapter that uses the existing internal LLM service (invokeLLM)
 */

import { ILLMProvider, LLMMessage, LLMResponse } from '../../ports/ILLMProvider';
import { invokeLLM } from '../../_core/llm';

export class InternalLLMAdapter implements ILLMProvider {
  async generateCompletion(messages: LLMMessage[]): Promise<LLMResponse> {
    const response = await invokeLLM({ messages });

    const messageContent = response.choices[0]?.message?.content;
    const content = typeof messageContent === 'string' ? messageContent : '';
    const finishReason = response.choices[0]?.finish_reason ?? undefined;

    return {
      content,
      finishReason,
    };
  }
}
