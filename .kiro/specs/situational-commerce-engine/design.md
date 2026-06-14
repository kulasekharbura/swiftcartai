# Design Document: Situational Commerce Engine

## Overview

The Situational Commerce Engine is the core feature of an intent-driven quick commerce platform. It transforms shopping from search-driven to intent-driven by allowing users to describe situations in natural language and receiving AI-generated shopping carts. The system uses a layered architecture with a provider-agnostic AI service, Prisma-based persistence, and a Next.js full-stack framework. The MVP includes three capabilities: situational cart generation (primary), predictive smart cart (secondary), and voice input (demo layer).

## Architecture

The system follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (Next.js)                     │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ SituationInput│ │ CartDisplay  │ │ SmartCartPanel   │  │
│  │ VoiceButton   │ │ CartItem     │ │ RecommendationItem│ │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                   API Layer (Next.js Routes)              │
│  POST /api/parse-intent                                  │
│  POST /api/generate-cart                                 │
│  GET  /api/smart-cart/:userId                            │
│  POST /api/sessions                                      │
│  GET  /api/products                                      │
├─────────────────────────────────────────────────────────┤
│                   Service Layer                           │
│  ┌──────────────┐ ┌───────────────┐ ┌────────────────┐  │
│  │ IntentParser  │ │ CartGenerator │ │ SmartCartService│  │
│  └──────────────┘ └───────────────┘ └────────────────┘  │
│  ┌──────────────────────────────────────────────────┐    │
│  │            AIServiceLayer (Provider-Agnostic)      │    │
│  └──────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│                   Data Access Layer (Prisma)              │
│  ┌──────────────┐ ┌───────────────┐ ┌────────────────┐  │
│  │ SessionRepo   │ │ ProductRepo   │ │ UserRepo       │  │
│  └──────────────┘ └───────────────┘ └────────────────┘  │
├─────────────────────────────────────────────────────────┤
│              Database (PostgreSQL via Supabase)           │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Input (text/voice)
       │
       ▼
┌─────────────────┐     ┌──────────────────┐
│ Voice Interface │────▶│ Situation Input   │
│ (Web Speech API)│     │ (text field)      │
└─────────────────┘     └────────┬─────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ POST /api/parse-intent  │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ IntentParser Service    │
                    │ (calls AIServiceLayer) │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ POST /api/generate-cart │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ CartGenerator Service   │
                    │ (calls AIServiceLayer) │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ Generated Cart Display  │
                    │ (review / modify)       │
                    └────────────┬───────────┘
                                 │ Approve
                                 ▼
                    ┌────────────────────────┐
                    │ POST /api/sessions      │
                    │ (persist to DB)         │
                    └────────────────────────┘
```

## Components and Interfaces

```typescript
// === Core Domain Types ===

interface ParsedIntent {
  occasionType: string;
  groupSize: number;
  constraints: string[];
  preferences: string[];
  rawDescription: string;
  additionalContext?: Record<string, unknown>; // extensible context params
}

interface CartItem {
  id: string;
  productName: string;
  quantity: number;
  estimatedPrice: number;
  reasoning: string;
  category: string;
}

interface GeneratedCart {
  id: string;
  items: CartItem[];
  totalEstimatedCost: number;
  generatedAt: string;
  situationDescription: string;
  parsedIntent: ParsedIntent;
}

interface SmartCartRecommendation {
  id: string;
  productName: string;
  quantity: number;
  estimatedPrice: number;
  reason: string; // e.g., "You bought this 3 times in the last month"
  confidence: number; // 0-1 score
}

// === API Request/Response Types ===

interface ParseIntentRequest {
  description: string;
  additionalContext?: Record<string, unknown>;
}

interface ParseIntentResponse {
  success: boolean;
  intent?: ParsedIntent;
  error?: string;
}

interface GenerateCartRequest {
  intent: ParsedIntent;
  productCatalog?: string[]; // optional filter
}

interface GenerateCartResponse {
  success: boolean;
  cart?: GeneratedCart;
  error?: string;
}

interface SmartCartResponse {
  success: boolean;
  recommendations: SmartCartRecommendation[];
  eligible: boolean; // false if < 2 prior sessions
}

interface SessionCreateRequest {
  userId: string;
  description: string;
  parsedIntent: ParsedIntent;
  approvedItems: CartItem[];
}

// === AI Service Layer Types ===

interface AIProvider {
  name: string;
  sendPrompt(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
}

interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
}

interface AIResponse {
  content: string;
  usage?: { promptTokens: number; completionTokens: number };
}

interface AIServiceConfig {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}
```

## Data Models

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Supabase PostgreSQL connection string
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String    @id @default(cuid())
  createdAt DateTime  @default(now())
  sessions  Session[]
}

model Session {
  id               String        @id @default(cuid())
  userId           String
  user             User          @relation(fields: [userId], references: [id])
  description      String
  parsedIntent     String        // JSON-serialized ParsedIntent
  createdAt        DateTime      @default(now())
  approvedItems    ApprovedItem[]
}

model ApprovedItem {
  id             String   @id @default(cuid())
  sessionId      String
  session        Session  @relation(fields: [sessionId], references: [id])
  productName    String
  quantity       Int
  estimatedPrice Float
  category       String
  reasoning      String
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  category    String
  price       Float
  imageUrl    String?
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

## AI Service Layer Design

The AI Service Layer is the central abstraction for all LLM interactions. It uses a **strategy pattern with a provider registry** to allow provider swapping. Adding a new provider (e.g., Gemini, Claude, Llama) requires ONLY:

1. Creating a new class implementing the `AIProvider` interface
2. Registering it in the provider registry
3. Changing the `AI_PROVIDER` environment variable

No service logic, API routes, or UI code needs any modification.

### Provider Registry

```typescript
// src/services/ai/provider-registry.ts
type ProviderFactory = (config: AIServiceConfig) => AIProvider;

class AIProviderRegistry {
  private static providers = new Map<string, ProviderFactory>();

  static register(name: string, factory: ProviderFactory): void {
    this.providers.set(name, factory);
  }

  static create(config: AIServiceConfig): AIProvider {
    const factory = this.providers.get(config.provider);
    if (!factory) {
      const available = Array.from(this.providers.keys()).join(', ');
      throw new AIConfigError(
        `Unknown provider: "${config.provider}". Available providers: ${available}`
      );
    }
    return factory(config);
  }

  static getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Register built-in providers
AIProviderRegistry.register('openai', (config) => new OpenAIProvider(config));
```

### AI Service Layer (uses registry)

```typescript
// src/services/ai/ai-service.ts
class AIServiceLayer {
  private provider: AIProvider;

  constructor(config?: AIServiceConfig) {
    const resolvedConfig = this.resolveConfig(config);
    if (!resolvedConfig.apiKey) {
      throw new AIConfigError('API key is missing. Set AI_API_KEY environment variable.');
    }
    this.provider = AIProviderRegistry.create(resolvedConfig);
  }

  private resolveConfig(config?: AIServiceConfig): AIServiceConfig {
    return {
      provider: config?.provider ?? process.env.AI_PROVIDER ?? 'openai',
      apiKey: config?.apiKey ?? process.env.AI_API_KEY ?? '',
      model: config?.model ?? process.env.AI_MODEL ?? 'gpt-4o-mini',
      endpoint: config?.endpoint ?? process.env.AI_ENDPOINT,
    };
  }

  async parseIntent(description: string, context?: Record<string, unknown>): Promise<ParsedIntent> {
    const prompt = buildIntentPrompt(description, context);
    const response = await this.provider.sendPrompt(prompt, { responseFormat: 'json' });
    return parseIntentResponse(response.content);
  }

  async generateCart(intent: ParsedIntent): Promise<GeneratedCart> {
    const prompt = buildCartPrompt(intent);
    const response = await this.provider.sendPrompt(prompt, { responseFormat: 'json' });
    return parseCartResponse(response.content, intent);
  }
}
```

### Adding a New Provider (Example: GeminiProvider)

To add a new AI provider, create the implementation and register it — no other code changes required:

```typescript
// src/services/ai/providers/gemini-provider.ts
import { AIProvider, AIRequestOptions, AIResponse, AIServiceConfig } from '../ai-types';
import { AIServiceError } from '../ai-errors';

class GeminiProvider implements AIProvider {
  name = 'gemini';
  private apiKey: string;
  private model: string;

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model ?? 'gemini-1.5-flash';
  }

  async sendPrompt(prompt: string, options?: AIRequestOptions): Promise<AIResponse> {
    // Implementation using Google Generative AI SDK
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new AIServiceError(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount ?? 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      },
    };
  }
}

// Register the provider (in providers/index.ts or at app startup)
AIProviderRegistry.register('gemini', (config) => new GeminiProvider(config));
```

Then set `AI_PROVIDER=gemini` in `.env` — the rest of the application works unchanged.

### Provider Implementation (OpenAI)

```typescript
// src/services/ai/providers/openai-provider.ts
class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;

  constructor(config: AIServiceConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.endpoint,
    });
  }

  async sendPrompt(prompt: string, options?: AIRequestOptions): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        response_format: options?.responseFormat === 'json'
          ? { type: 'json_object' }
          : undefined,
      });
      return {
        content: completion.choices[0].message.content ?? '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens ?? 0,
          completionTokens: completion.usage?.completion_tokens ?? 0,
        },
      };
    } catch (error) {
      if (error instanceof OpenAI.AuthenticationError) {
        throw new AIConfigError('Invalid API key. Check AI_API_KEY environment variable.');
      }
      throw new AIServiceError('Failed to reach LLM provider', { cause: error });
    }
  }
}
```

## API Route Specifications

### POST /api/parse-intent

Parses a situational description into structured intent.

- **Request Body:** `ParseIntentRequest`
- **Response:** `ParseIntentResponse`
- **Validation:** Description must be 1-500 characters, non-whitespace-only
- **Errors:** 400 (validation), 503 (AI service unavailable)

### POST /api/generate-cart

Generates a shopping cart from parsed intent.

- **Request Body:** `GenerateCartRequest`
- **Response:** `GenerateCartResponse`
- **Validation:** Intent must have occasionType and groupSize > 0
- **Errors:** 400 (invalid intent), 503 (AI service unavailable)

### GET /api/smart-cart/:userId

Returns predictive replenishment recommendations for a user.

- **Path Param:** `userId`
- **Response:** `SmartCartResponse`
- **Logic:** Returns `eligible: false` if user has fewer than 2 sessions
- **Max items:** 5 recommendations

### POST /api/sessions

Persists an approved session to the database.

- **Request Body:** `SessionCreateRequest`
- **Response:** `{ success: boolean; sessionId: string }`
- **Validation:** All required fields present, items array non-empty

### GET /api/products

Returns available product catalog (for display/reference).

- **Query Params:** `?category=string&search=string`
- **Response:** `{ products: Product[] }`

## Key Algorithms

### Intent Parsing Algorithm

The intent parser uses a structured LLM prompt to extract semantic meaning:

```typescript
function buildIntentPrompt(description: string, context?: Record<string, unknown>): string {
  const contextSection = context
    ? `\nAdditional context: ${JSON.stringify(context)}`
    : '';

  return `
You are a shopping intent parser. Analyze the following situation description and extract:
1. occasionType: The type of event or need (e.g., "movie_night", "camping_trip", "birthday_party")
2. groupSize: Estimated number of people (default to 1 if not mentioned)
3. constraints: Any limitations mentioned (budget, dietary, time, etc.)
4. preferences: Any preferences indicated (brands, styles, etc.)

Situation: "${description}"${contextSection}

Respond in JSON format:
{
  "occasionType": string,
  "groupSize": number,
  "constraints": string[],
  "preferences": string[]
}`;
}
```

### Cart Generation Algorithm

The cart generator builds on the parsed intent to produce a complete cart:

```typescript
function buildCartPrompt(intent: ParsedIntent): string {
  return `
You are a shopping cart generator. Based on the following parsed intent, generate a complete shopping cart.

Intent:
- Occasion: ${intent.occasionType}
- Group size: ${intent.groupSize}
- Constraints: ${intent.constraints.join(', ') || 'None'}
- Preferences: ${intent.preferences.join(', ') || 'None'}
- Original description: "${intent.rawDescription}"

Generate between 3 and 20 items. For each item provide:
- productName: Clear product name
- quantity: Appropriate quantity for the group size
- estimatedPrice: Realistic price in USD
- reasoning: One sentence explaining why this item fits the situation
- category: One of "Food & Drinks", "Supplies", "Entertainment", "Household", "Personal Care", "Other"

Respond in JSON format:
{
  "items": [{ "productName", "quantity", "estimatedPrice", "reasoning", "category" }]
}`;
}
```

### Smart Cart Scoring Algorithm

The Smart Cart uses frequency and recency to score replenishment candidates:

```typescript
interface ReplenishmentScore {
  productName: string;
  frequency: number;     // times purchased in history
  recencyDays: number;   // days since last purchase
  score: number;         // computed relevance score
}

function computeSmartCartRecommendations(
  sessions: Session[],
  maxRecommendations: number = 5
): SmartCartRecommendation[] {
  // 1. Aggregate items across all approved sessions
  const itemFrequency = new Map<string, { count: number; lastPurchased: Date; avgQuantity: number; avgPrice: number }>();

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

  // 2. Score each item: higher frequency + moderate recency = higher score
  const now = new Date();
  const scored: ReplenishmentScore[] = [];

  for (const [name, data] of itemFrequency) {
    const daysSinceLast = (now.getTime() - data.lastPurchased.getTime()) / (1000 * 60 * 60 * 24);
    // Score formula: frequency weight (0.6) + recency decay (0.4)
    const frequencyScore = Math.min(data.count / sessions.length, 1);
    const recencyScore = Math.max(0, 1 - daysSinceLast / 90); // decay over 90 days
    const score = frequencyScore * 0.6 + recencyScore * 0.4;

    scored.push({ productName: name, frequency: data.count, recencyDays: daysSinceLast, score });
  }

  // 3. Sort by score descending, take top N
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxRecommendations).map((item) => ({
    id: generateId(),
    productName: item.productName,
    quantity: Math.round(itemFrequency.get(item.productName)!.avgQuantity),
    estimatedPrice: itemFrequency.get(item.productName)!.avgPrice,
    reason: `Purchased ${item.frequency} time(s) across your sessions`,
    confidence: item.score,
  }));
}
```

## Component Design

### UI Components (React/Next.js)

| Component | Responsibility |
|-----------|---------------|
| `SituationInput` | Text field + submit button, validation, example prompts |
| `VoiceButton` | Microphone toggle, Web Speech API integration |
| `LoadingState` | Animated indicator during AI processing |
| `CartDisplay` | Renders generated cart with categories, items, totals |
| `CartItem` | Single item row with quantity controls and remove button |
| `CartSummary` | Total cost display, approve/regenerate actions |
| `SmartCartPanel` | Recommendations section for eligible users |
| `RecommendationItem` | Single recommendation with "Add to cart" action |
| `ErrorBanner` | Error display with retry action |

### Page Structure (App Router)

```
src/app/
├── page.tsx              # Main page: input + cart display
├── layout.tsx            # Root layout with providers
├── api/
│   ├── parse-intent/
│   │   └── route.ts     # POST handler
│   ├── generate-cart/
│   │   └── route.ts     # POST handler
│   ├── smart-cart/
│   │   └── [userId]/
│   │       └── route.ts # GET handler
│   ├── sessions/
│   │   └── route.ts     # POST handler
│   └── products/
│       └── route.ts     # GET handler
└── components/
    ├── SituationInput.tsx
    ├── VoiceButton.tsx
    ├── CartDisplay.tsx
    ├── CartItem.tsx
    ├── CartSummary.tsx
    ├── SmartCartPanel.tsx
    ├── RecommendationItem.tsx
    ├── LoadingState.tsx
    └── ErrorBanner.tsx
```

### Service Layer Structure

```
src/services/
├── ai/
│   ├── ai-service.ts           # AIServiceLayer class
│   ├── ai-types.ts             # Interfaces
│   ├── ai-errors.ts            # Custom error classes
│   ├── provider-registry.ts    # AIProviderRegistry (register/create pattern)
│   ├── prompts/
│   │   ├── intent-prompt.ts    # Intent parsing prompt builder
│   │   └── cart-prompt.ts      # Cart generation prompt builder
│   └── providers/
│       ├── index.ts            # Registers all built-in providers
│       ├── openai-provider.ts  # OpenAI implementation
│       └── gemini-provider.ts  # Gemini implementation (example)
├── intent-parser.ts             # IntentParser service
├── cart-generator.ts            # CartGenerator service
├── smart-cart.ts                # SmartCart service
└── validation.ts                # Input validation utilities
```

### Data Access Layer

```
src/data/
├── prisma.ts              # Prisma client singleton
├── session-repo.ts        # Session CRUD operations
├── product-repo.ts        # Product queries
└── user-repo.ts           # User queries
```

## Technology Choices

| Technology | Justification |
|-----------|---------------|
| **Next.js 14+ (App Router)** | Full-stack in one framework: SSR pages, API routes, React components. Ideal for hackathon speed. |
| **TypeScript** | Type safety across all layers, enables interface-driven design, catches errors at compile time. |
| **Tailwind CSS** | Utility-first CSS for rapid UI development without context-switching to style files. |
| **Prisma** | Type-safe ORM with auto-generated client from schema. Provides type-safe queries and migrations. |
| **PostgreSQL (Supabase)** | Supabase's free tier provides hosted PostgreSQL with built-in auth (future), real-time subscriptions (future), and zero-ops database management. Single database for all environments. |
| **OpenAI GPT-4o-mini** | Cost-effective, fast inference, strong JSON mode support. Provider-agnostic wrapper allows future swaps. |
| **Web Speech API** | Browser-native, no additional dependencies. Graceful fallback when unsupported. |
| **cuid** | Collision-resistant IDs suitable for distributed systems, short enough for demo URLs. |

## Error Handling

```typescript
// Custom error hierarchy
class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

class AIConfigError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

class AIServiceError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 503);
  }
}
```

API routes catch errors and return structured responses:

```typescript
// Pattern used in all API routes
export async function POST(request: Request) {
  try {
    // ... business logic
    return Response.json({ success: true, data });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ success: false, error: error.message }, { status: 400 });
    }
    if (error instanceof AIServiceError) {
      return Response.json({ success: false, error: error.message, retryable: true }, { status: 503 });
    }
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
```

## Scaling Considerations

- **Caching:** LLM responses for identical/similar inputs can be cached in-memory or Redis to reduce API costs and latency
- **Rate limiting:** API routes should implement per-user rate limiting to prevent abuse of the AI endpoints
- **Streaming:** Future iteration could stream cart generation results token-by-token for perceived speed
- **Product catalog:** Currently AI generates product names; future version could match against a real catalog with vector similarity search
- **Session batching:** Smart Cart computation can be pre-computed nightly for production scale rather than computed on each request
- **Provider failover:** AI provider registry can be extended with fallback logic (e.g., try GPT-4o-mini → fall back to Gemini) by wrapping the registry's `create` method

## Testing Strategy

The project uses a dual testing approach:

- **Unit tests (Vitest):** Verify specific examples, edge cases, error handling, and integration points between layers. Focus on concrete scenarios like empty input rejection, AI service error responses, and specific cart modification flows.
- **Property-based tests (fast-check + Vitest):** Verify universal properties across randomized inputs. Each property test runs a minimum of 100 iterations. Key targets include input validation boundaries, cart invariants (total cost, item count bounds), smart cart limits, and session persistence round trips.

Test organization mirrors the source structure:

```
src/__tests__/
├── services/
│   ├── ai-service.test.ts        # Provider interface conformance, config resolution
│   ├── intent-parser.test.ts     # Parsed intent structure validation
│   ├── cart-generator.test.ts    # Cart bounds, item completeness
│   └── smart-cart.test.ts        # Eligibility, recommendation limits
├── validation/
│   └── input-validation.test.ts  # Length bounds, whitespace rejection
├── data/
│   └── session-repo.test.ts      # Persistence round trip
└── properties/
    ├── cart-invariants.prop.ts    # Property tests for cart operations
    ├── validation.prop.ts        # Property tests for input validation
    └── smart-cart.prop.ts        # Property tests for recommendation engine
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Input length boundary validation

*For any* string input, the situational input field SHALL accept descriptions with length between 1 and 500 characters (inclusive) and reject descriptions that exceed 500 characters or are empty.

**Validates: Requirements 1.1**

### Property 2: Whitespace-only input rejection

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines, or combinations thereof), the validation layer SHALL reject the input and the system state SHALL remain unchanged.

**Validates: Requirements 1.3**

### Property 3: Intent parsing produces valid structured output

*For any* valid situational description (1-500 non-whitespace-only characters), the Intent Parser SHALL return a ParsedIntent object containing a non-empty occasionType string, a groupSize integer ≥ 1, and arrays for constraints and preferences.

**Validates: Requirements 2.1, 2.2**

### Property 4: Generated cart size bounds

*For any* valid ParsedIntent, the Cart Generator SHALL produce a GeneratedCart containing between 3 and 20 items (inclusive).

**Validates: Requirements 3.1**

### Property 5: Cart item completeness

*For any* item in a GeneratedCart, the item SHALL have a non-empty productName, a quantity ≥ 1, an estimatedPrice > 0, a non-empty reasoning string, and a non-empty category string.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 6: Cart total cost invariant

*For any* GeneratedCart (including after any sequence of item removals or quantity adjustments), the displayed totalEstimatedCost SHALL equal the sum of (estimatedPrice × quantity) for all remaining items in the cart.

**Validates: Requirements 3.5, 4.4**

### Property 7: Item removal correctness

*For any* GeneratedCart containing N items, removing a specific item by ID SHALL result in a cart containing exactly N-1 items, and the removed item SHALL not appear in the resulting cart.

**Validates: Requirements 4.1**

### Property 8: Quantity adjustment correctness

*For any* cart item and any valid positive integer quantity Q, setting that item's quantity to Q SHALL result in the item's quantity being exactly Q in the cart state.

**Validates: Requirements 4.2**

### Property 9: AI provider interface conformance

*For any* class implementing the AIProvider interface, calling sendPrompt with a valid prompt string SHALL return an AIResponse containing a content string, regardless of which provider implementation is used.

**Validates: Requirements 5.1**

### Property 10: Environment variable configuration

*For any* set of environment variables (AI_PROVIDER, AI_API_KEY, AI_MODEL, AI_ENDPOINT), the AIServiceLayer SHALL use these values to configure the provider, and SHALL default to provider "openai" and model "gpt-4o-mini" when the respective variables are unset.

**Validates: Requirements 5.3**

### Property 11: Smart cart eligibility threshold

*For any* user with at least 2 prior sessions containing approved carts, the Smart Cart service SHALL return a non-empty list of recommendations. For any user with fewer than 2 prior sessions, the Smart Cart service SHALL return an empty list with eligible=false.

**Validates: Requirements 6.1**

### Property 12: Smart cart recommendation limit

*For any* user regardless of purchase history size, the Smart Cart service SHALL return at most 5 recommendations.

**Validates: Requirements 6.4**

### Property 13: Session persistence round trip

*For any* approved GeneratedCart, persisting the session and then retrieving it SHALL return a session containing the original situational description, a valid timestamp, and the complete list of approved items with their quantities, prices, and categories intact.

**Validates: Requirements 8.1, 8.4**

### Property 14: Extensible context parameters

*For any* valid Record<string, unknown> object passed as additionalContext to the AI Service Layer, the service SHALL accept it without error and include it in the prompt context without requiring interface changes.

**Validates: Requirements 10.2**
