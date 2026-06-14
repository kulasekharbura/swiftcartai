export function buildIntentPrompt(description: string, context?: Record<string, unknown>): string {
  const contextSection = context
    ? `\nAdditional context: ${JSON.stringify(context)}`
    : '';

  return `You are a shopping intent parser for a quick commerce platform. Analyze the following situation and extract ALL shopping intents.

IMPORTANT: The user may describe MULTIPLE needs in a single request. Detect ALL intents separately.

For EACH intent detected, extract:
1. occasionType: snake_case identifier (e.g., "chicken_biryani", "study_session")
2. groupSize: Number of people (default 2)
3. constraints: Limitations (budget, dietary, etc.)
4. preferences: Preferences (brands, styles, etc.)
5. intentCategory: One of: recipe, event, restocking, emergency, snack, general

Situation: "${description}"${contextSection}

Respond with valid JSON:
{
  "intents": [
    {
      "occasionType": "string",
      "groupSize": number,
      "constraints": ["string"],
      "preferences": ["string"],
      "intentCategory": "recipe|event|restocking|emergency|snack|general"
    }
  ]
}

Rules:
- If multiple situations mentioned (e.g., "biryani and study session"), return MULTIPLE intents
- If only one intent, still wrap in "intents" array
- Each intent classified independently
- groupSize >= 1, occasionType in snake_case`;
}
