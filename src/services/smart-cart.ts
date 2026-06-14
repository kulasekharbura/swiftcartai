import cuid from 'cuid';
import { SmartCartRecommendation, ParsedIntent } from '@/types/index';
import { findSessionsByUserId, countSessionsByUserId } from '@/data/session-repo';
import { TEMPLATES, IntentCategory } from './templates/templates';

interface SessionWithItems {
  id: string;
  description: string;
  parsedIntent: string; // JSON-serialized ParsedIntent
  createdAt: Date;
  approvedItems: Array<{
    productName: string;
    quantity: number;
    estimatedPrice: number;
    category: string;
  }>;
}

interface SmartCartResult {
  eligible: boolean;
  recommendations: SmartCartRecommendation[];
  source: 'history' | 'template-fallback' | 'none';
}

/**
 * Context-aware smart cart recommendations.
 * 
 * Logic:
 * 1. Determine current intent category
 * 2. Find previous sessions matching the same category
 * 3. Generate recommendations from those sessions
 * 4. If insufficient category-specific history, fall back to category templates
 */
export async function getSmartCartRecommendations(
  userId: string,
  currentIntentCategory?: IntentCategory
): Promise<SmartCartResult> {
  const sessionCount = await countSessionsByUserId(userId);

  // If no history at all, use template fallback for the current category
  if (sessionCount === 0) {
    if (currentIntentCategory) {
      return {
        eligible: true,
        recommendations: getTemplateFallbackRecommendations(currentIntentCategory),
        source: 'template-fallback',
      };
    }
    return { eligible: false, recommendations: [], source: 'none' };
  }

  const sessions = await findSessionsByUserId(userId) as SessionWithItems[];

  // Filter sessions by matching intent category
  const categorySessions = currentIntentCategory
    ? sessions.filter(session => {
        try {
          const intent = JSON.parse(session.parsedIntent) as ParsedIntent;
          return intent.intentCategory === currentIntentCategory;
        } catch {
          return false;
        }
      })
    : sessions;

  // If we have category-specific history (≥1 session), use it
  if (categorySessions.length >= 1 && currentIntentCategory) {
    const recommendations = computeCategoryRecommendations(categorySessions, currentIntentCategory, 5);
    if (recommendations.length > 0) {
      return { eligible: true, recommendations, source: 'history' };
    }
  }

  // Fallback to template-based recommendations for the current category
  if (currentIntentCategory) {
    return {
      eligible: true,
      recommendations: getTemplateFallbackRecommendations(currentIntentCategory),
      source: 'template-fallback',
    };
  }

  // No category context — use general frequency-based (legacy behavior) only if ≥2 sessions
  if (sessionCount >= 2) {
    return {
      eligible: true,
      recommendations: computeGeneralRecommendations(sessions, 5),
      source: 'history',
    };
  }

  return { eligible: false, recommendations: [], source: 'none' };
}

/**
 * Generate recommendations from sessions of the SAME intent category.
 * Only recommends items that are contextually relevant.
 */
function computeCategoryRecommendations(
  sessions: SessionWithItems[],
  category: IntentCategory,
  maxRecommendations: number
): SmartCartRecommendation[] {
  const itemFrequency = new Map<string, {
    count: number;
    lastPurchased: Date;
    avgQuantity: number;
    avgPrice: number;
  }>();

  for (const session of sessions) {
    for (const item of session.approvedItems) {
      const existing = itemFrequency.get(item.productName) || {
        count: 0,
        lastPurchased: new Date(0),
        avgQuantity: 0,
        avgPrice: 0,
      };
      existing.count += 1;
      existing.lastPurchased = session.createdAt > existing.lastPurchased
        ? session.createdAt
        : existing.lastPurchased;
      existing.avgQuantity = (existing.avgQuantity * (existing.count - 1) + item.quantity) / existing.count;
      existing.avgPrice = (existing.avgPrice * (existing.count - 1) + item.estimatedPrice) / existing.count;
      itemFrequency.set(item.productName, existing);
    }
  }

  const now = new Date();
  const scored: Array<{ productName: string; score: number; frequency: number }> = [];

  for (const [name, data] of itemFrequency) {
    const daysSinceLast = (now.getTime() - data.lastPurchased.getTime()) / (1000 * 60 * 60 * 24);
    const frequencyScore = Math.min(data.count / sessions.length, 1);
    const recencyScore = Math.max(0, 1 - daysSinceLast / 90);
    const score = frequencyScore * 0.6 + recencyScore * 0.4;
    scored.push({ productName: name, score, frequency: data.count });
  }

  scored.sort((a, b) => b.score - a.score);

  const categoryLabel = getCategoryLabel(category);

  return scored.slice(0, maxRecommendations).map((item) => {
    const data = itemFrequency.get(item.productName)!;
    return {
      id: cuid(),
      productName: item.productName,
      quantity: Math.round(data.avgQuantity),
      estimatedPrice: Math.round(data.avgPrice),
      reason: `Frequently used in your ${categoryLabel} sessions`,
      confidence: item.score,
    };
  });
}

/**
 * Fallback: Generate recommendations from curated templates for the category.
 * Used when user has no/insufficient history for this category.
 */
function getTemplateFallbackRecommendations(category: IntentCategory): SmartCartRecommendation[] {
  // Find templates matching the category
  const categoryTemplates = TEMPLATES.filter(t => t.intentCategory === category);
  if (categoryTemplates.length === 0) return [];

  // Collect core items across all templates in this category
  const itemMap = new Map<string, { name: string; price: number; count: number }>();

  for (const template of categoryTemplates) {
    for (const item of template.items) {
      if (item.isCore) {
        const existing = itemMap.get(item.name);
        if (existing) {
          existing.count += 1;
        } else {
          itemMap.set(item.name, { name: item.name, price: item.basePrice, count: 1 });
        }
      }
    }
  }

  // Sort by frequency across templates (most common items first)
  const sorted = Array.from(itemMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const categoryLabel = getCategoryLabel(category);

  return sorted.map(item => ({
    id: cuid(),
    productName: item.name,
    quantity: 1,
    estimatedPrice: item.price,
    reason: `Popular for ${categoryLabel} situations`,
    confidence: 0.7,
  }));
}

/**
 * Legacy general frequency-based recommendations (no category filter).
 * Used when no current intent category is provided.
 */
function computeGeneralRecommendations(
  sessions: SessionWithItems[],
  maxRecommendations: number
): SmartCartRecommendation[] {
  const itemFrequency = new Map<string, {
    count: number;
    lastPurchased: Date;
    avgQuantity: number;
    avgPrice: number;
  }>();

  for (const session of sessions) {
    for (const item of session.approvedItems) {
      const existing = itemFrequency.get(item.productName) || {
        count: 0,
        lastPurchased: new Date(0),
        avgQuantity: 0,
        avgPrice: 0,
      };
      existing.count += 1;
      existing.lastPurchased = session.createdAt > existing.lastPurchased
        ? session.createdAt
        : existing.lastPurchased;
      existing.avgQuantity = (existing.avgQuantity * (existing.count - 1) + item.quantity) / existing.count;
      existing.avgPrice = (existing.avgPrice * (existing.count - 1) + item.estimatedPrice) / existing.count;
      itemFrequency.set(item.productName, existing);
    }
  }

  const now = new Date();
  const scored: Array<{ productName: string; score: number; frequency: number }> = [];

  for (const [name, data] of itemFrequency) {
    const daysSinceLast = (now.getTime() - data.lastPurchased.getTime()) / (1000 * 60 * 60 * 24);
    const frequencyScore = Math.min(data.count / sessions.length, 1);
    const recencyScore = Math.max(0, 1 - daysSinceLast / 90);
    const score = frequencyScore * 0.6 + recencyScore * 0.4;
    scored.push({ productName: name, score, frequency: data.count });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxRecommendations).map((item) => {
    const data = itemFrequency.get(item.productName)!;
    return {
      id: cuid(),
      productName: item.productName,
      quantity: Math.round(data.avgQuantity),
      estimatedPrice: Math.round(data.avgPrice),
      reason: `Purchased ${item.frequency} time${item.frequency > 1 ? 's' : ''} recently`,
      confidence: item.score,
    };
  });
}

function getCategoryLabel(category: IntentCategory): string {
  switch (category) {
    case 'recipe': return 'cooking';
    case 'event': return 'event hosting';
    case 'restocking': return 'grocery restocking';
    case 'emergency': return 'emergency';
    case 'snack': return 'snacking';
    default: return 'shopping';
  }
}

// Keep legacy export for backward compatibility
export { computeGeneralRecommendations as computeRecommendations };
