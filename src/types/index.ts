// Core Domain Types

export interface ParsedIntent {
  occasionType: string;
  groupSize: number;
  constraints: string[];
  preferences: string[];
  rawDescription: string;
  additionalContext?: Record<string, unknown>;
  intentCategory?: 'recipe' | 'event' | 'restocking' | 'emergency' | 'snack' | 'general';
}

export interface CartItem {
  id: string;
  productName: string;
  quantity: number;
  estimatedPrice: number;
  reasoning: string;
  category: string;
}

export interface CartReasoning {
  summary: string;
  keyDecisions: string[];
  estimatedBudget: string;
}

export interface GeneratedCart {
  id: string;
  items: CartItem[];
  totalEstimatedCost: number;
  generatedAt: string;
  situationDescription: string;
  parsedIntent: ParsedIntent;
  cartReasoning?: CartReasoning;
}

export interface SmartCartRecommendation {
  id: string;
  productName: string;
  quantity: number;
  estimatedPrice: number;
  reason: string;
  confidence: number;
}

export interface HouseholdProfile {
  householdSize: number;
  diet: 'vegetarian' | 'non-vegetarian' | 'vegan';
  budget: 'budget' | 'standard' | 'premium';
}
