import { AIProvider, AIServiceConfig } from '@/types/ai';
import { AIConfigError } from '@/services/errors';

type ProviderFactory = (config: AIServiceConfig) => AIProvider;

export class AIProviderRegistry {
  private static providers = new Map<string, ProviderFactory>();

  static register(name: string, factory: ProviderFactory): void {
    this.providers.set(name, factory);
  }

  static create(config: AIServiceConfig): AIProvider {
    const factory = this.providers.get(config.provider);
    if (!factory) {
      const available = Array.from(this.providers.keys()).join(', ');
      throw new AIConfigError(
        `Unknown provider: "${config.provider}". Available providers: ${available}`
      );
    }
    return factory(config);
  }

  static getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
