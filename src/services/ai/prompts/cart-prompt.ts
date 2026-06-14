import { ParsedIntent } from '@/types/index';

export function buildCartPrompt(intent: ParsedIntent): string {
  let householdSection = '';
  if (intent.additionalContext) {
    const ctx = intent.additionalContext;
    const parts: string[] = [];
    if (ctx.householdSize && typeof ctx.householdSize === 'number') {
      parts.push(`- Household size: ${ctx.householdSize} people`);
    }
    if (ctx.diet && typeof ctx.diet === 'string') {
      parts.push(`- Dietary preference: ${ctx.diet} (strictly follow this constraint)`);
    }
    if (ctx.budget && typeof ctx.budget === 'string') {
      parts.push(`- Budget level: ${ctx.budget} (choose products at this price tier)`);
    }
    if (parts.length > 0) {
      householdSection = `\n\nHousehold Context:\n${parts.join('\n')}`;
    }
  }

  return `You are a shopping cart generator for a quick commerce (instant delivery) platform. Based on the following parsed shopping intent, generate a complete, ready-to-order shopping cart.

Intent:
- Occasion: ${intent.occasionType}
- Group size: ${intent.groupSize} people
- Constraints: ${intent.constraints.length > 0 ? intent.constraints.join(', ') : 'None'}
- Preferences: ${intent.preferences.length > 0 ? intent.preferences.join(', ') : 'None'}
- Original description: "${intent.rawDescription}"${householdSection}

Generate between 5 and 15 items that would be appropriate for this situation. For each item provide:
- productName: A specific, real product name (e.g., "Lay's Classic Potato Chips 200g" not just "chips")
- quantity: Appropriate quantity for the group size
- estimatedPrice: Realistic price in INR (Indian Rupees) for quick commerce
- reasoning: One sentence explaining why this item fits the situation
- category: One of "Food & Drinks", "Snacks", "Beverages", "Supplies", "Entertainment", "Household", "Personal Care", "Other"

You MUST respond with valid JSON in this exact format:
{
  "items": [
    {
      "productName": "string",
      "quantity": number,
      "estimatedPrice": number,
      "reasoning": "string",
      "category": "string"
    }
  ],
  "cartReasoning": {
    "summary": "One sentence summarizing what this cart is for and why these items were chosen",
    "keyDecisions": ["Decision 1 explaining a specific choice", "Decision 2", "Decision 3"],
    "estimatedBudget": "budget|moderate|premium"
  }
}

Rules:
- Generate 5-15 items (closer to 8-12 is ideal)
- Prices should be realistic for Indian quick commerce (Blinkit/Zepto/Instamart pricing)
- Quantities should match the group size
- Include a mix of categories appropriate to the occasion
- Be creative but practical — these are items for immediate delivery
- Each item's reasoning should be specific to the situation, not generic
- cartReasoning.keyDecisions should have 3-4 bullet points explaining why specific items or categories were chosen
- cartReasoning.estimatedBudget should reflect the overall price tier of items selected`;
}
