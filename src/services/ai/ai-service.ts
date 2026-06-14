import './providers';
import { AIProvider, AIServiceConfig } from '@/types/ai';
import { ParsedIntent, CartItem, CartReasoning } from '@/types/index';
import { AIConfigError } from '@/services/errors';
import { AIProviderRegistry } from './provider-registry';
import { buildIntentPrompt } from './prompts/intent-prompt';
import { buildCartPrompt } from './prompts/cart-prompt';

export class AIServiceLayer {
  private provider: AIProvider;

  constructor(config?: Partial<AIServiceConfig>) {
    const resolvedConfig = this.resolveConfig(config);
    if (!resolvedConfig.apiKey) {
      throw new AIConfigError(
        'API key is missing. Set AI_API_KEY environment variable.'
      );
    }
    this.provider = AIProviderRegistry.create(resolvedConfig);
  }

  private resolveConfig(config?: Partial<AIServiceConfig>): AIServiceConfig {
    return {
      provider: config?.provider ?? process.env.AI_PROVIDER ?? 'openai',
      apiKey: config?.apiKey ?? process.env.AI_API_KEY ?? '',
      model: config?.model ?? process.env.AI_MODEL ?? 'gpt-4o-mini',
      endpoint: config?.endpoint ?? process.env.AI_ENDPOINT,
    };
  }

  async parseIntent(
    description: string,
    context?: Record<string, unknown>
  ): Promise<ParsedIntent> {
    const prompt = buildIntentPrompt(description, context);
    const response = await this.provider.sendPrompt(prompt, {
      responseFormat: 'json',
    });
    const parsed = JSON.parse(response.content);
    return {
      occasionType: parsed.occasionType ?? 'general',
      groupSize: parsed.groupSize ?? 1,
      constraints: parsed.constraints ?? [],
      preferences: parsed.preferences ?? [],
      rawDescription: description,
      additionalContext: context,
      intentCategory: parsed.intentCategory ?? 'general',
    } as ParsedIntent;
  }

  async parseMultiIntent(
    description: string,
    context?: Record<string, unknown>
  ): Promise<ParsedIntent[]> {
    const prompt = buildIntentPrompt(description, context);
    const response = await this.provider.sendPrompt(prompt, { responseFormat: 'json' });
    const parsed = JSON.parse(response.content);

    const intents = Array.isArray(parsed.intents) ? parsed.intents : [parsed];
    return intents.map((intent: Record<string, unknown>) => ({
      occasionType: (intent.occasionType as string) ?? 'general',
      groupSize: (intent.groupSize as number) ?? 1,
      constraints: (intent.constraints as string[]) ?? [],
      preferences: (intent.preferences as string[]) ?? [],
      rawDescription: description,
      additionalContext: context,
      intentCategory: (intent.intentCategory as string) ?? 'general',
    } as ParsedIntent));
  }

  async generateCart(intent: ParsedIntent): Promise<CartItem[]> {
    const prompt = buildCartPrompt(intent);
    const response = await this.provider.sendPrompt(prompt, {
      responseFormat: 'json',
    });
    const parsed = JSON.parse(response.content);
    return (parsed.items ?? []) as CartItem[];
  }

  async generateCartWithReasoning(intent: ParsedIntent): Promise<{ items: CartItem[]; cartReasoning?: CartReasoning }> {
    const prompt = buildCartPrompt(intent);
    const response = await this.provider.sendPrompt(prompt, {
      responseFormat: 'json',
    });
    const parsed = JSON.parse(response.content);
    const items = (parsed.items ?? []) as CartItem[];
    const cartReasoning = parsed.cartReasoning as CartReasoning | undefined;
    return { items, cartReasoning };
  }

  async sendPrompt(prompt: string, options?: { responseFormat?: 'json' | 'text' }): Promise<{ content: string }> {
    return this.provider.sendPrompt(prompt, options);
  }
}
