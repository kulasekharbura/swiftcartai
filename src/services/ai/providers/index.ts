import { AIProviderRegistry } from '../provider-registry';
import { OpenAIProvider } from './openai-provider';
import { GeminiProvider } from './gemini-provider';

// Register built-in providers
AIProviderRegistry.register('openai', (config) => new OpenAIProvider(config));
AIProviderRegistry.register('gemini', (config) => new GeminiProvider(config));
