import cuid from 'cuid';
import { ParsedIntent, CartItem, CartReasoning, GeneratedCart } from '@/types/index';
import { AIServiceLayer } from '@/services/ai/ai-service';
import { AIServiceError } from '@/services/errors';

export class CartGenerator {
  private aiService: AIServiceLayer;

  constructor(aiService?: AIServiceLayer) {
    this.aiService = aiService ?? new AIServiceLayer();
  }

  async generate(intent: ParsedIntent): Promise<GeneratedCart> {
    // 1. Call AI service to generate cart items (with reasoning)
    const { items: rawItems, cartReasoning } = await this.aiService.generateCartWithReasoning(intent);

    // 2. Validate and normalize items
    const items = this.validateAndNormalizeItems(rawItems);

    // 3. Enforce bounds (cap at 20 items)
    const boundedItems = this.enforceBounds(items);

    // 4. Assign unique IDs to each item
    const cartItems = boundedItems.map((item) => ({
      ...item,
      id: cuid(),
    }));

    // 5. Compute total estimated cost
    const totalEstimatedCost = this.computeTotal(cartItems);

    // 6. Build and return GeneratedCart
    return {
      id: cuid(),
      items: cartItems,
      totalEstimatedCost,
      generatedAt: new Date().toISOString(),
      situationDescription: intent.rawDescription,
      parsedIntent: intent,
      cartReasoning,
    };
  }

  private validateAndNormalizeItems(rawItems: CartItem[]): CartItem[] {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new AIServiceError(
        'AI failed to generate cart items. Please try again.'
      );
    }

    return rawItems.map((item) => ({
      id: '', // will be assigned later
      productName: item.productName?.trim() || 'Unknown Product',
      quantity:
        typeof item.quantity === 'number' && item.quantity >= 1
          ? Math.round(item.quantity)
          : 1,
      estimatedPrice:
        typeof item.estimatedPrice === 'number' && item.estimatedPrice > 0
          ? item.estimatedPrice
          : 0,
      reasoning: item.reasoning?.trim() || 'Recommended for your situation',
      category: item.category?.trim() || 'Other',
    }));
  }

  private enforceBounds(items: CartItem[]): CartItem[] {
    if (items.length > 20) {
      return items.slice(0, 20);
    }
    return items;
  }

  private computeTotal(items: CartItem[]): number {
    return items.reduce(
      (sum, item) => sum + item.estimatedPrice * item.quantity,
      0
    );
  }
}
