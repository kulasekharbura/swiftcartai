// API Request/Response Types

import type { ParsedIntent, CartItem, GeneratedCart, SmartCartRecommendation } from './index';

export interface ParseIntentRequest {
  description: string;
  additionalContext?: Record<string, unknown>;
}

export interface ParseIntentResponse {
  success: boolean;
  intent?: ParsedIntent;
  error?: string;
}

export interface GenerateCartRequest {
  intent: ParsedIntent;
  productCatalog?: string[];
}

export interface GenerateCartResponse {
  success: boolean;
  cart?: GeneratedCart;
  error?: string;
}

export interface SmartCartResponse {
  success: boolean;
  recommendations: SmartCartRecommendation[];
  eligible: boolean;
}

export interface SessionCreateRequest {
  userId: string;
  description: string;
  parsedIntent: ParsedIntent;
  approvedItems: CartItem[];
}
