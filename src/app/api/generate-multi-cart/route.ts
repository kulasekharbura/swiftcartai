import { NextResponse } from 'next/server';
import { AIServiceLayer } from '@/services/ai/ai-service';
import { HybridCartGenerator } from '@/services/hybrid-cart-generator';
import { AIServiceError, AIConfigError } from '@/services/errors';
import { ParsedIntent, CartItem, GeneratedCart, CartReasoning } from '@/types/index';
import cuid from 'cuid';

interface MultiCartRequest {
  description: string;
  additionalContext?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    let body: MultiCartRequest;
    try {
      body = (await request.json()) as MultiCartRequest;
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const { description, additionalContext } = body;
    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json({ success: false, error: 'description is required' }, { status: 400 });
    }

    const aiService = new AIServiceLayer();
    const generator = new HybridCartGenerator(aiService);

    // Parse multiple intents
    const intents = await aiService.parseMultiIntent(description, additionalContext);

    // Generate cart for each intent
    const allItems: CartItem[] = [];
    const intentLabels: string[] = [];
    let combinedReasoning: CartReasoning | undefined;

    for (const intent of intents) {
      const cart = await generator.generate(intent);

      // Tag items with their intent source
      const taggedItems = cart.items.map(item => ({
        ...item,
        category: item.category, // Keep original category for grouping
      }));

      allItems.push(...taggedItems);

      // Build intent label
      const emoji = getIntentEmoji(intent.intentCategory || 'general');
      const label = intent.occasionType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      intentLabels.push(`${emoji} ${label}`);

      if (!combinedReasoning && cart.cartReasoning) {
        combinedReasoning = cart.cartReasoning;
      }
    }

    // Merge duplicate items (combine quantities)
    const mergedItems = mergeCartItems(allItems);

    const totalEstimatedCost = mergedItems.reduce(
      (sum, item) => sum + item.estimatedPrice * item.quantity, 0
    );

    // Build combined reasoning
    if (intents.length > 1) {
      combinedReasoning = {
        summary: `Combined cart for ${intentLabels.join(' and ')}`,
        keyDecisions: [
          `Detected ${intents.length} separate intents from your description`,
          `Generated items for each intent independently`,
          `Merged ${allItems.length - mergedItems.length} duplicate items automatically`,
          ...intentLabels.map(l => `Included: ${l}`),
        ],
        estimatedBudget: combinedReasoning?.estimatedBudget || 'moderate',
      };
    }

    const cart: GeneratedCart = {
      id: cuid(),
      items: mergedItems,
      totalEstimatedCost,
      generatedAt: new Date().toISOString(),
      situationDescription: description,
      parsedIntent: intents[0], // Primary intent for backward compat
      cartReasoning: combinedReasoning,
    };

    return NextResponse.json({
      success: true,
      intents,
      intentLabels,
      cart,
    });
  } catch (error) {
    if (error instanceof AIConfigError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    if (error instanceof AIServiceError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 503 });
    }
    console.error('Multi-cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

function mergeCartItems(items: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of items) {
    const key = item.productName.toLowerCase();
    if (merged.has(key)) {
      const existing = merged.get(key)!;
      existing.quantity += item.quantity;
    } else {
      merged.set(key, { ...item, id: cuid() });
    }
  }

  return Array.from(merged.values());
}

function getIntentEmoji(category: string): string {
  switch (category) {
    case 'recipe': return '🍳';
    case 'event': return '🎉';
    case 'restocking': return '🛒';
    case 'emergency': return '🚨';
    case 'snack': return '🍿';
    default: return '📦';
  }
}
