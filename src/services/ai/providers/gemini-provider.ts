import { AIProvider, AIRequestOptions, AIResponse, AIServiceConfig } from '@/types/ai';
import { AIConfigError, AIServiceError } from '@/services/errors';

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private apiKey: string;
  private model: string;

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-2.0-flash';
  }

  async sendPrompt(prompt: string, options?: AIRequestOptions): Promise<AIResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const body: Record<string, unknown> = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2000,
        ...(options?.responseFormat === 'json' && {
          responseMimeType: 'application/json',
        }),
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = (errorData as { error?: { message?: string } })?.error?.message || response.statusText;

        if (response.status === 401 || response.status === 403) {
          throw new AIConfigError(`Invalid Gemini API key: ${errorMessage}`);
        }
        throw new AIServiceError(`Gemini API error (${response.status}): ${errorMessage}`);
      }

      const data = await response.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
      };

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      return {
        content,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount ?? 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
        },
      };
    } catch (error) {
      if (error instanceof AIConfigError || error instanceof AIServiceError) {
        throw error;
      }
      throw new AIServiceError('Failed to reach Gemini API', { cause: error });
    }
  }
}
