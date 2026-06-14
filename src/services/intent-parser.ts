import { ParsedIntent } from '@/types/index';
import { AIServiceLayer } from '@/services/ai/ai-service';
import { validateSituationInput } from '@/services/validation';
import { ValidationError } from '@/services/errors';

export class IntentParser {
  private aiService: AIServiceLayer;

  constructor(aiService?: AIServiceLayer) {
    this.aiService = aiService ?? new AIServiceLayer();
  }

  async parse(
    description: string,
    context?: Record<string, unknown>
  ): Promise<ParsedIntent> {
    // 1. Validate input (1-500 chars, non-whitespace-only)
    const validation = validateSituationInput(description);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    // 2. Call AI service to parse intent
    const intent = await this.aiService.parseIntent(description, context);

    // 3. Validate and normalize the parsed result
    return this.validateAndNormalize(intent, description, context);
  }

  private validateAndNormalize(
    intent: ParsedIntent,
    description: string,
    context?: Record<string, unknown>
  ): ParsedIntent {
    return {
      occasionType:
        intent.occasionType && intent.occasionType.trim() !== ''
          ? intent.occasionType
          : 'general',
      groupSize:
        typeof intent.groupSize === 'number' && intent.groupSize >= 1
          ? Math.round(intent.groupSize)
          : 1,
      constraints: Array.isArray(intent.constraints) ? intent.constraints : [],
      preferences: Array.isArray(intent.preferences) ? intent.preferences : [],
      rawDescription: description,
      additionalContext: context,
    };
  }
}
