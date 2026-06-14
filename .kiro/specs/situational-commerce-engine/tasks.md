# Implementation Plan: Situational Commerce Engine

## Overview

Hackathon-optimized implementation plan for an intent-driven quick commerce platform (Amazon HackOn 2026). Tasks are organized into 4 phases, each producing a usable demo. Strategy: Phase 1 alone wins the hackathon; everything else is bonus. Stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, Prisma + PostgreSQL (Supabase), OpenAI GPT-4o-mini with provider-agnostic registry.

---

## Feature Prioritization

### P0 — Must Have (Core Demo)

| Feature | Business Value | Demo Value | Effort | Why P0 |
|---------|:---:|:---:|--------|--------|
| Situational Commerce Engine | 10/10 | 10/10 | High | THE hero feature. This IS the product. |
| AI Cart Generation | 10/10 | 10/10 | High | Without this, there's no "intent-driven shopping" |
| Cart Review & Editing | 9/10 | 8/10 | Medium | "Reduce effort, not control" — core principle |
| Provider-Agnostic AI Layer | 7/10 | 6/10 | Medium | Architecture judges care. Enables future flexibility. |
| Responsive UI + Polish | 8/10 | 9/10 | Medium | Demo quality = presentation score. First impression. |

### P1 — Important (Elevates Demo)

| Feature | Business Value | Demo Value | Effort | Why P1 |
|---------|:---:|:---:|--------|--------|
| Voice Shopping | 7/10 | 9/10 | Low | Wow factor for demos. Thin layer on top of same AI pipeline. |
| Session Persistence | 7/10 | 5/10 | Low-Med | Enables Smart Cart. Shows data story. |
| Product Catalog (seeded) | 5/10 | 4/10 | Low | Makes demo realistic. Referenced by AI. |

### P2 — Nice to Have (Intelligence Layer)

| Feature | Business Value | Demo Value | Effort | Why P2 |
|---------|:---:|:---:|--------|--------|
| Predictive Smart Cart | 8/10 | 7/10 | Medium | Shows intelligence. Requires session history. |
| Smart Cart Recommendations | 7/10 | 6/10 | Medium | Builds on Smart Cart. Demonstrates ML thinking. |
| User Profiles | 5/10 | 3/10 | Low | Enables personalization. |

### P3 — Future Vision Only (Pitch Deck Material)

| Feature | Business Value | Demo Value | Effort | Why P3 |
|---------|:---:|:---:|--------|--------|
| Household Intelligence Engine | 9/10 | N/A | Very High | Production feature. Mention in roadmap. |
| Smart Cart Merge | 7/10 | N/A | High | Family commerce. Pitch only. |
| Panic Mode Shopping | 8/10 | N/A | High | Emergency use case. Pitch only. |
| Freshness Assurance | 7/10 | N/A | High | Supply chain integration. Pitch only. |
| Sustainability Dashboard | 6/10 | N/A | Medium | ESG story. Pitch only. |
| Calendar Integration | 7/10 | N/A | Medium | Context enrichment. Pitch only. |
| Weather Integration | 6/10 | N/A | Medium | Context enrichment. Pitch only. |
| Family Commerce | 8/10 | N/A | Very High | Multi-user. Pitch only. |
| Analytics Layer | 5/10 | N/A | Medium | Business insight. Not demo-worthy. |
| Recommendation Engine | 7/10 | N/A | High | ML-heavy. Pitch only. |

---

## Phased Implementation Strategy

### Phase 1: "The Hero Demo" (Hours 0–16)
**Goal:** Complete end-to-end product that can already win the hackathon by itself.
**Deliverable:** User types a situation → AI generates a smart cart → User reviews/edits → Approve.
**After Phase 1:** You have a WORKING DEMO with polished UI.

### Phase 2: "The Wow Factor" (Hours 16–28)
**Goal:** Significantly elevate the demo with voice input and data persistence.
**Deliverable:** Voice shopping input + session storage + seeded product catalog.

### Phase 3: "The Intelligence Layer" (Hours 28–40)
**Goal:** Add predictive intelligence that shows the platform LEARNS.
**Deliverable:** Smart Cart recommendations based on purchase history.

### Phase 4: "Polish & Safety Net" (Hours 40–48)
**Goal:** Final polish, error handling hardening, property tests for code quality judges.
**Deliverable:** Bullet-proof error states, responsive perfection, test coverage.

---

## Tasks

- [x] 1. Phase 1: Project Foundation (scaffolding + types + errors)
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript and Tailwind CSS
    - Run `create-next-app` with App Router, TypeScript, Tailwind, ESLint
    - Configure `tsconfig.json` path aliases (`@/` for `src/`)
    - Add dependencies: `openai`, `cuid`
    - Add dev dependencies: `vitest`, `fast-check`, `@testing-library/react`
    - Create `.env.local` template with `AI_API_KEY`, `AI_PROVIDER`, `AI_MODEL`, `AI_ENDPOINT`, `DATABASE_URL`
    - _Requirements: 9.2, 9.4, 10.4_

  - [x] 1.2 Define ALL core TypeScript interfaces and types upfront
    - Create `src/types/index.ts` with domain interfaces: `ParsedIntent`, `CartItem`, `GeneratedCart`, `SmartCartRecommendation`
    - Create `src/types/api.ts` with request/response types: `ParseIntentRequest`, `ParseIntentResponse`, `GenerateCartRequest`, `GenerateCartResponse`, `SmartCartResponse`, `SessionCreateRequest`
    - Create `src/types/ai.ts` with AI layer types: `AIProvider`, `AIRequestOptions`, `AIResponse`, `AIServiceConfig`
    - _Requirements: 10.3_

  - [x] 1.3 Create custom error classes and validation utilities
    - Create `src/services/errors.ts` with `AppError`, `ValidationError`, `AIConfigError`, `AIServiceError`
    - Create `src/services/validation.ts` with input validation (1-500 chars, non-whitespace-only)
    - _Requirements: 1.3, 2.3_

- [x] 2. Phase 1: AI Service Layer (provider-agnostic registry)
  - [x] 2.1 Implement AI Provider Registry and AI Service Layer core
    - Create `src/services/ai/ai-types.ts` with `AIProvider`, `AIRequestOptions`, `AIResponse`, `AIServiceConfig` interfaces
    - Create `src/services/ai/ai-errors.ts` with `AIConfigError`, `AIServiceError` classes
    - Create `src/services/ai/provider-registry.ts` with `AIProviderRegistry` class implementing register/create pattern
    - Create `src/services/ai/ai-service.ts` with `AIServiceLayer` class that uses `AIProviderRegistry.create()` to instantiate providers
    - Implement `resolveConfig()` reading from env vars with defaults (provider: "openai", model: "gpt-4o-mini")
    - Validate API key presence on construction, throw `AIConfigError` if missing
    - Expose `parseIntent()` and `generateCart()` methods on `AIServiceLayer`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 2.2 Implement OpenAI provider and register in provider registry
    - Create `src/services/ai/providers/openai-provider.ts` implementing `AIProvider` interface
    - Handle `sendPrompt()` with JSON response format option
    - Map OpenAI-specific errors (AuthenticationError → AIConfigError)
    - Create `src/services/ai/providers/index.ts` that registers OpenAI provider via `AIProviderRegistry.register('openai', ...)`
    - Include a stub comment for adding a Gemini provider (showing only `AIProviderRegistry.register('gemini', ...)` call needed)
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 2.3 Create prompt builders for intent parsing and cart generation
    - Create `src/services/ai/prompts/intent-prompt.ts` with `buildIntentPrompt()`
    - Create `src/services/ai/prompts/cart-prompt.ts` with `buildCartPrompt()`
    - Include structured JSON output instructions in prompts
    - Support `additionalContext` parameter in intent prompt for extensibility
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.4, 10.2_

- [x] 3. Phase 1: Intent Parser + Cart Generator services
  - [x] 3.1 Implement IntentParser service
    - Create `src/services/intent-parser.ts`
    - Validate input (length 1-500, non-whitespace-only)
    - Call `AIServiceLayer.parseIntent()`
    - Parse and validate LLM response into `ParsedIntent` structure
    - Ensure `groupSize >= 1`, `occasionType` non-empty
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.2 Implement CartGenerator service
    - Create `src/services/cart-generator.ts`
    - Call `AIServiceLayer.generateCart()` with parsed intent
    - Parse and validate LLM response into `GeneratedCart`
    - Enforce 3-20 item bounds, compute `totalEstimatedCost`
    - Assign unique IDs (cuid) to cart and items
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Phase 1: API routes for core flow
  - [x] 4.1 Implement POST /api/parse-intent route
    - Create `src/app/api/parse-intent/route.ts`
    - Validate request body (description: 1-500 chars, non-whitespace)
    - Call IntentParser service
    - Return structured `ParseIntentResponse`
    - Handle errors with appropriate status codes (400, 503)
    - _Requirements: 1.1, 1.3, 2.2, 2.3_

  - [x] 4.2 Implement POST /api/generate-cart route
    - Create `src/app/api/generate-cart/route.ts`
    - Validate request body (intent must have occasionType, groupSize > 0)
    - Call CartGenerator service
    - Return structured `GenerateCartResponse`
    - Handle errors with appropriate status codes (400, 503)
    - _Requirements: 3.1, 3.3, 3.5_

- [x] 5. Phase 1: Core UI components
  - [x] 5.1 Create root layout with global styles and fonts
    - Update `src/app/layout.tsx` with metadata, fonts (Inter/system), global styles
    - Set up page title "SituCart — Intent-Driven Quick Commerce"
    - _Requirements: 9.4_

  - [x] 5.2 Create SituationInput component with validation and example prompts
    - Create `src/app/components/SituationInput.tsx`
    - Text input field accepting up to 500 characters with character count
    - Submit button with loading state
    - Display clickable example prompts ("Movie night for 6", "Camping trip this weekend", "Baby's first birthday party")
    - Client-side validation: empty/whitespace-only rejection with error message
    - Show loading state within 500ms of submission
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 5.3 Create LoadingState and ErrorBanner components
    - Create `src/app/components/LoadingState.tsx` with animated skeleton/spinner
    - Create `src/app/components/ErrorBanner.tsx` with error message and retry button
    - _Requirements: 2.3, 9.3_

  - [x] 5.4 Create CartDisplay and CartItem components (grouped by category)
    - Create `src/app/components/CartDisplay.tsx` rendering items grouped by category
    - Create `src/app/components/CartItem.tsx` with product name, quantity, price, reasoning
    - Each item has quantity +/- controls and remove button
    - Category headers with visual distinction
    - _Requirements: 3.3, 3.4, 4.1, 4.2_

  - [x] 5.5 Create CartSummary component (total + approve + regenerate)
    - Create `src/app/components/CartSummary.tsx`
    - Display total estimated cost (recalculated on any modification within 200ms)
    - "Approve Cart" button and "Regenerate" button
    - Item count summary
    - _Requirements: 3.5, 4.3, 4.4, 4.5_

  - [x] 5.6 Wire main page: full flow (input → AI → cart → edit → approve)
    - Update `src/app/page.tsx` to orchestrate: input → parse intent → generate cart → display
    - Manage state machine: idle → loading → cart display → approved
    - Handle errors with ErrorBanner and retry
    - Implement cart modification (remove items, adjust quantities, recalculate total)
    - Implement regenerate flow (back to input with modified description)
    - _Requirements: 1.2, 2.3, 4.1, 4.2, 4.4, 4.5_

  - [x] 5.7 Implement responsive layout (375px–1920px)
    - Apply Tailwind responsive utilities across all components
    - Ensure usable layout on mobile (375px), tablet (768px), and desktop (1920px)
    - Mobile: stacked layout with full-width input and cart
    - Desktop: centered content with max-width container
    - _Requirements: 9.1, 9.2_

- [x] 6. Phase 1 Checkpoint — Hero Demo Complete
  - Ensure all tests pass, ask the user if questions arise.
  - At this point: User can type situation → AI generates cart → User edits/approves. Full working demo.

- [x] 7. Phase 2: Voice Shopping (wow factor)
  - [x] 7.1 Create VoiceButton component with Web Speech API
    - Create `src/app/components/VoiceButton.tsx`
    - Implement microphone activation/deactivation toggle with visual feedback
    - Use `webkitSpeechRecognition` / `SpeechRecognition` API
    - Populate SituationInput field with transcription on completion
    - Hide button if Web Speech API not supported (feature detection)
    - Show error and retry option on transcription failure
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 7.2 Integrate VoiceButton into main page
    - Add VoiceButton alongside SituationInput
    - Wire transcription result to input field state
    - User reviews transcription before submitting
    - _Requirements: 7.3_

- [x] 8. Phase 2: Data Persistence Layer
  - [x] 8.1 Set up Prisma schema and Supabase PostgreSQL database
    - Add dependencies: `prisma`, `@prisma/client`
    - Create `prisma/schema.prisma` with `User`, `Session`, `ApprovedItem`, `Product` models
    - Configure PostgreSQL datasource with `url = env("DATABASE_URL")` pointing to Supabase
    - Run `prisma generate` and `prisma db push`
    - Create `src/data/prisma.ts` Prisma client singleton
    - _Requirements: 8.2, 8.3_

  - [x] 8.2 Seed database with sample products
    - Create `prisma/seed.ts` with products across categories: Food & Drinks, Supplies, Entertainment, Household, Personal Care
    - Include 30-50 realistic products with prices
    - Configure seed script in package.json
    - _Requirements: 10.1_

  - [x] 8.3 Implement data access repositories
    - Create `src/data/session-repo.ts` with create/findByUserId operations
    - Create `src/data/product-repo.ts` with findAll/findByCategory/search
    - Create `src/data/user-repo.ts` with findOrCreate
    - All operations go through Prisma against Supabase PostgreSQL
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.1_

  - [x] 8.4 Implement POST /api/sessions route
    - Create `src/app/api/sessions/route.ts`
    - Validate request body (userId, description, parsedIntent, approvedItems non-empty)
    - Persist session to database via Prisma
    - Return `{ success: true, sessionId }`
    - _Requirements: 8.1, 8.4_

  - [x] 8.5 Implement GET /api/products route
    - Create `src/app/api/products/route.ts`
    - Support optional query params: `category`, `search`
    - Return filtered product list from database
    - _Requirements: 10.1_

  - [x] 8.6 Wire "Approve Cart" to persist sessions in UI
    - On "Approve Cart", call POST /api/sessions
    - Store userId in localStorage for session continuity
    - Show success confirmation after approval
    - _Requirements: 8.1, 8.4_

- [x] 9. Phase 2 Checkpoint — Voice + Persistence Working
  - Ensure all tests pass, ask the user if questions arise.
  - At this point: Voice input works, approved carts are saved to database.

- [x] 10. Phase 3: Predictive Smart Cart
  - [x] 10.1 Implement SmartCart service
    - Create `src/services/smart-cart.ts`
    - Implement `computeSmartCartRecommendations()` with frequency + recency scoring
    - Enforce eligibility threshold (≥ 2 sessions with approved carts)
    - Cap recommendations at 5 items
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 10.2 Implement GET /api/smart-cart/[userId] route
    - Create `src/app/api/smart-cart/[userId]/route.ts`
    - Query user sessions, check eligibility (≥ 2 sessions)
    - Return `SmartCartResponse` with recommendations or `eligible: false`
    - _Requirements: 6.1, 6.5_

  - [x] 10.3 Create SmartCartPanel and RecommendationItem components
    - Create `src/app/components/SmartCartPanel.tsx` as separate section
    - Create `src/app/components/RecommendationItem.tsx` with "Add to cart" action
    - Only display when user is eligible (≥ 2 sessions)
    - Visual distinction from main cart (different background/border)
    - _Requirements: 6.2, 6.3, 6.5_

  - [x] 10.4 Wire Smart Cart into main page (show if user is eligible)
    - Check user eligibility on page load (if userId exists in localStorage)
    - Display SmartCartPanel above or beside main cart when eligible
    - "Add to cart" action integrates recommended items into current Generated_Cart
    - _Requirements: 6.3, 6.5_

- [x] 11. Phase 3 Checkpoint — Intelligence Layer Working
  - Ensure all tests pass, ask the user if questions arise.
  - At this point: Returning users see predictive recommendations.

- [ ] 12. Phase 4: Property Tests — Input Validation
  - [ ]* 12.1 Write property test for input length boundary validation
    - **Property 1: Input length boundary validation**
    - Test: strings of length 1-500 accepted, >500 and empty rejected
    - **Validates: Requirements 1.1**

  - [ ]* 12.2 Write property test for whitespace-only input rejection
    - **Property 2: Whitespace-only input rejection**
    - Test: any string of only whitespace chars is rejected
    - **Validates: Requirements 1.3**

- [ ] 13. Phase 4: Property Tests — Cart Invariants
  - [ ]* 13.1 Write property test for generated cart size bounds
    - **Property 4: Generated cart size bounds**
    - Test: cart always contains 3-20 items for any valid intent
    - **Validates: Requirements 3.1**

  - [ ]* 13.2 Write property test for cart item completeness
    - **Property 5: Cart item completeness**
    - Test: every item has non-empty productName, quantity ≥ 1, price > 0, reasoning, category
    - **Validates: Requirements 3.2, 3.3, 3.4**

  - [ ]* 13.3 Write property test for cart total cost invariant
    - **Property 6: Cart total cost invariant**
    - Test: totalEstimatedCost always equals sum of (price × quantity) for all items
    - **Validates: Requirements 3.5, 4.4**

- [ ] 14. Phase 4: Property Tests — Cart Modification
  - [ ]* 14.1 Write property test for item removal correctness
    - **Property 7: Item removal correctness**
    - Test: removing item by ID yields N-1 items, removed item absent
    - **Validates: Requirements 4.1**

  - [ ]* 14.2 Write property test for quantity adjustment correctness
    - **Property 8: Quantity adjustment correctness**
    - Test: setting quantity to Q results in item.quantity === Q
    - **Validates: Requirements 4.2**

- [ ] 15. Phase 4: Property Tests — AI & Smart Cart
  - [ ]* 15.1 Write property test for AI provider interface conformance
    - **Property 9: AI provider interface conformance**
    - Test: any AIProvider implementation returns AIResponse with content string
    - **Validates: Requirements 5.1**

  - [ ]* 15.2 Write property test for environment variable configuration
    - **Property 10: Environment variable configuration**
    - Test: config resolution uses env vars with correct defaults
    - **Validates: Requirements 5.3**

  - [ ]* 15.3 Write property test for smart cart eligibility threshold
    - **Property 11: Smart cart eligibility threshold**
    - Test: ≥ 2 sessions → recommendations returned; < 2 → eligible=false
    - **Validates: Requirements 6.1**

  - [ ]* 15.4 Write property test for smart cart recommendation limit
    - **Property 12: Smart cart recommendation limit**
    - Test: never more than 5 recommendations regardless of history size
    - **Validates: Requirements 6.4**

- [ ] 16. Phase 4: Property Tests — Persistence & Extensibility
  - [ ]* 16.1 Write property test for session persistence round trip
    - **Property 13: Session persistence round trip**
    - Test: persist then retrieve returns matching description, items, timestamp
    - **Validates: Requirements 8.1, 8.4**

  - [ ]* 16.2 Write property test for extensible context parameters
    - **Property 14: Extensible context parameters**
    - Test: any Record<string, unknown> accepted as additionalContext without error
    - **Validates: Requirements 10.2**

  - [ ]* 16.3 Write property test for intent parser output structure
    - **Property 3: Intent parsing produces valid structured output**
    - Test: valid input always produces ParsedIntent with required fields
    - **Validates: Requirements 2.1, 2.2**

- [ ] 17. Final Checkpoint — All Tests Pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each phase boundary
- **Phase 1 alone is a winning demo.** Everything else is bonus.
- Voice (Phase 2) is cheap effort for massive wow factor during live demo
- Smart Cart (Phase 3) shows the platform is INTELLIGENT, not just a chatbot wrapper
- Property tests (Phase 4) are insurance — nice for code quality judges but not demo-critical
- AI Provider Registry is built in Phase 1 (not deferred) because it takes ~30 min extra vs hardcoding and shows "production thinking"
- The extensibility story (Gemini, Claude) is powerful in the pitch even without implementing extra providers
- Database setup is deferred to Phase 2 because Phase 1 works entirely without persistence (in-memory state)
- Hackathon time budget: Phase 1 (45%) → Phase 2 (25%) → Phase 3 (20%) → Phase 4 (10%)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3"] },
    { "id": 4, "tasks": ["3.1", "3.2"] },
    { "id": 5, "tasks": ["4.1", "4.2", "5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3"] },
    { "id": 7, "tasks": ["5.4", "5.5"] },
    { "id": 8, "tasks": ["5.6"] },
    { "id": 9, "tasks": ["5.7"] },
    { "id": 10, "tasks": ["7.1", "8.1"] },
    { "id": 11, "tasks": ["7.2", "8.2", "8.3"] },
    { "id": 12, "tasks": ["8.4", "8.5"] },
    { "id": 13, "tasks": ["8.6"] },
    { "id": 14, "tasks": ["10.1"] },
    { "id": 15, "tasks": ["10.2", "10.3"] },
    { "id": 16, "tasks": ["10.4"] },
    { "id": 17, "tasks": ["12.1", "12.2", "13.1", "13.2", "13.3"] },
    { "id": 18, "tasks": ["14.1", "14.2", "15.1", "15.2", "15.3", "15.4"] },
    { "id": 19, "tasks": ["16.1", "16.2", "16.3"] }
  ]
}
```
