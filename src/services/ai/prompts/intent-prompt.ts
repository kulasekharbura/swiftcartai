export function buildIntentPrompt(description: string, context?: Record<string, unknown>): string {
  const contextSection = context
    ? `\nAdditional context: ${JSON.stringify(context)}`
    : '';

  return `You are a shopping intent parser for a quick commerce platform. Analyze the following situation description and extract structured shopping intent.

Extract:
1. occasionType: The type of event or need (e.g., "movie_night", "camping_trip", "birthday_party", "weekly_groceries", "guest_hosting")
2. groupSize: Estimated number of people involved (default to 2 if not explicitly mentioned)
3. constraints: Any limitations mentioned (budget, dietary restrictions, time constraints, allergies, etc.)
4. preferences: Any preferences indicated (brands, cuisines, organic, specific items, etc.)
5. intentCategory: Classify the request into one of these categories:
   - "recipe" — cooking a specific dish or meal
   - "event" — preparing for an event or occasion (party, movie night, guests)
   - "restocking" — regular grocery/household restocking
   - "emergency" — urgent needs (power outage, medical, etc.)
   - "snack" — casual snacking, study sessions, munchies
   - "general" — anything that doesn't fit the above

Situation: "${description}"${contextSection}

You MUST respond with valid JSON in this exact format:
{
  "occasionType": "string",
  "groupSize": number,
  "constraints": ["string"],
  "preferences": ["string"],
  "intentCategory": "recipe|event|restocking|emergency|snack|general"
}

Rules:
- occasionType should be a snake_case descriptive identifier
- groupSize must be an integer >= 1
- constraints and preferences should be arrays (empty [] if none detected)
- intentCategory must be exactly one of: recipe, event, restocking, emergency, snack, general
- Be generous in interpretation — infer reasonable defaults from context`;
}
