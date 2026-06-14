import OpenAI from 'openai';
import { AIProvider, AIRequestOptions, AIResponse, AIServiceConfig } from '@/types/ai';
import { AIConfigError, AIServiceError } from '@/services/errors';

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;
  private model: string;

  constructor(config: AIServiceConfig) {
    this.model = config.model;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      ...(config.endpoint && { baseURL: config.endpoint }),
    });
  }

  async sendPrompt(prompt: string, options?: AIRequestOptions): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        ...(options?.responseFormat === 'json' && {
          response_format: { type: 'json_object' },
        }),
      });
      return {
        content: completion.choices[0]?.message?.content ?? '',
        usage: completion.usage
          ? {
              promptTokens: completion.usage.prompt_tokens ?? 0,
              completionTokens: completion.usage.completion_tokens ?? 0,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof OpenAI.AuthenticationError) {
        throw new AIConfigError('Invalid API key. Check AI_API_KEY environment variable.');
      }
      throw new AIServiceError('Failed to reach LLM provider', { cause: error });
    }
  }
}
