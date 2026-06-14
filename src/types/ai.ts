// AI Service Layer Types

export interface AIProvider {
  name: string;
  sendPrompt(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
}

export interface AIResponse {
  content: string;
  usage?: { promptTokens: number; completionTokens: number };
}

export interface AIServiceConfig {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}
