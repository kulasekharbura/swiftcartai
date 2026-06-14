import cuid from 'cuid';
import { ParsedIntent, CartItem, CartReasoning, GeneratedCart } from '@/types/index';
import { AIServiceLayer } from '@/services/ai/ai-service';
import { AIServiceError } from '@/services/errors';
import { matchTemplate } from './templates/matcher';
import { CartTemplate, TemplateItem } from './templates/templates';

export class HybridCartGenerator {
  private aiService: AIServiceLayer;

  constructor(aiService?: AIServiceLayer) {
    this.aiService = aiService ?? new AIServiceLayer();
  }

  async generate(intent: ParsedIntent): Promise<GeneratedCart> {
    // Step 1: Try to match a template
    const template = matchTemplate(intent);

    let cartItems: CartItem[];
    let cartReasoning: CartReasoning | undefined;

    if (template) {
      // Template-based generation (reliable, consistent)
      const result = await this.generateFromTemplate(template, intent);
      cartItems = result.items;
      cartReasoning = result.reasoning;
    } else {
      // Fallback to AI generation for unrecognized situations
      const result = await this.generateWithAI(intent);
      cartItems = result.items;
      cartReasoning = result.reasoning;
    }

    // Assign IDs
    cartItems = cartItems.map(item => ({ ...item, id: cuid() }));

    const totalEstimatedCost = cartItems.reduce(
      (sum, item) => sum + item.estimatedPrice * item.quantity, 0
    );

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

  private async generateFromTemplate(
    template: CartTemplate,
    intent: ParsedIntent
  ): Promise<{ items: CartItem[]; reasoning: CartReasoning }> {
    const groupSize = intent.groupSize;
    const diet = (intent.additionalContext?.diet as string) || 'non-vegetarian';
    const budget = (intent.additionalContext?.budget as string) || 'standard';

    // Build core items from template, scaling quantities
    let items: CartItem[] = template.items.map(templateItem => {
      const scaledQty = this.scaleQuantity(templateItem, groupSize);
      const adjustedPrice = this.adjustPrice(templateItem.basePrice, budget);

      return {
        id: '',
        productName: templateItem.name,
        quantity: scaledQty,
        estimatedPrice: adjustedPrice,
        reasoning: templateItem.isCore
          ? `Essential for ${template.name.toLowerCase()}`
          : `Recommended addition for ${template.name.toLowerCase()}`,
        category: templateItem.category,
      };
    });

    // Add optional addons based on budget
    if (template.optionalAddons && budget !== 'budget') {
      const addonsToInclude = budget === 'premium'
        ? template.optionalAddons
        : template.optionalAddons.slice(0, 1);

      for (const addon of addonsToInclude) {
        items.push({
          id: '',
          productName: addon.name,
          quantity: this.scaleQuantity(addon, groupSize),
          estimatedPrice: this.adjustPrice(addon.basePrice, budget),
          reasoning: `Optional enhancement for a better experience`,
          category: addon.category,
        });
      }
    }

    // Filter based on diet
    if (diet === 'vegetarian' || diet === 'vegan') {
      items = items.filter(item => {
        const name = item.productName.toLowerCase();
        return !name.includes('chicken') && !name.includes('mutton') &&
               !name.includes('fish') && !name.includes('egg') &&
               !name.includes('meat');
      });
    }

    // Use AI to generate personalized reasoning (NOT to change items)
    const reasoning = await this.generateReasoningWithAI(template, intent, items);

    return { items, reasoning };
  }

  private async generateReasoningWithAI(
    template: CartTemplate,
    intent: ParsedIntent,
    items: CartItem[]
  ): Promise<CartReasoning> {
    try {
      const prompt = this.buildReasoningPrompt(template, intent, items);
      const response = await this.aiService.sendPrompt(prompt, { responseFormat: 'json' });
      const parsed = JSON.parse(response.content);
      return {
        summary: parsed.summary || `Cart prepared for ${template.name}`,
        keyDecisions: parsed.keyDecisions || [`Selected ${template.name} template`, `Scaled for ${intent.groupSize} people`],
        estimatedBudget: parsed.estimatedBudget || 'moderate',
      };
    } catch {
      // Fallback reasoning if AI fails
      return {
        summary: `Cart prepared for ${template.name} for ${intent.groupSize} people`,
        keyDecisions: [
          `Matched "${intent.rawDescription}" to ${template.name} template`,
          `Scaled quantities for ${intent.groupSize} people`,
          `Included ${items.filter(i => i.reasoning.includes('Essential')).length} essential items`,
        ],
        estimatedBudget: (intent.additionalContext?.budget as string) || 'moderate',
      };
    }
  }

  private buildReasoningPrompt(template: CartTemplate, intent: ParsedIntent, items: CartItem[]): string {
    return `You are explaining a shopping cart selection for a quick commerce app.

Situation: "${intent.rawDescription}"
Template used: ${template.name}
Group size: ${intent.groupSize}
Items selected: ${items.map(i => i.productName).join(', ')}
Total items: ${items.length}

Generate a brief reasoning for this cart. Respond in JSON:
{
  "summary": "One sentence about what this cart fulfills",
  "keyDecisions": ["Why key items were chosen - 3 bullet points"],
  "estimatedBudget": "budget|moderate|premium"
}`;
  }

  private async generateWithAI(intent: ParsedIntent): Promise<{ items: CartItem[]; reasoning?: CartReasoning }> {
    // Fallback: use AI for situations without templates (existing behavior)
    const { items, cartReasoning } = await this.aiService.generateCartWithReasoning(intent);

    // Validate
    if (!Array.isArray(items) || items.length === 0) {
      throw new AIServiceError('AI failed to generate cart items. Please try again.');
    }

    const normalizedItems = items.map(item => ({
      id: '',
      productName: item.productName?.trim() || 'Unknown Product',
      quantity: typeof item.quantity === 'number' && item.quantity >= 1 ? Math.round(item.quantity) : 1,
      estimatedPrice: typeof item.estimatedPrice === 'number' && item.estimatedPrice > 0 ? item.estimatedPrice : 0,
      reasoning: item.reasoning?.trim() || 'Recommended for your situation',
      category: item.category?.trim() || 'Other',
    }));

    return { items: normalizedItems, reasoning: cartReasoning };
  }

  private scaleQuantity(item: TemplateItem, groupSize: number): number {
    const factor = item.scalingFactor ?? 0;
    const scaled = item.defaultQuantity + Math.floor(factor * (groupSize - 1));
    return Math.max(1, scaled);
  }

  private adjustPrice(basePrice: number, budget: string): number {
    switch (budget) {
      case 'budget': return Math.round(basePrice * 0.8);
      case 'premium': return Math.round(basePrice * 1.3);
      default: return basePrice;
    }
  }
}
