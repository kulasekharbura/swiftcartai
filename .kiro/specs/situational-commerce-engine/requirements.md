# Requirements Document

## Introduction

The Situational Commerce Engine is the hero feature of an intent-driven quick commerce platform built for Amazon HackOn 2026. Instead of requiring users to search for individual products, the system allows users to describe a situation or need in natural language (e.g., "hosting a movie night for 6 people") and receives an AI-generated shopping cart tailored to that context. The platform transforms quick commerce from search-driven to intent-driven shopping, reducing customer effort while preserving customer control.

The MVP includes three features: the Situational Commerce Engine (primary), Predictive Smart Cart (secondary), and Voice Shopping (demo layer). The architecture supports future expansion but the implementation focuses on a working, demo-ready prototype within hackathon constraints.

## Glossary

- **Situational_Commerce_Engine**: The core AI-powered system that interprets user-described situations and generates complete shopping carts
- **Intent_Parser**: The AI service component that analyzes natural language input to extract shopping intent, context, and constraints
- **Cart_Generator**: The component that transforms parsed intent into a structured list of product recommendations with quantities
- **Smart_Cart**: The predictive system that analyzes purchase history to recommend proactive replenishment items
- **Voice_Interface**: The browser-based speech recognition layer that converts spoken input into text for the AI pipeline
- **AI_Service_Layer**: The provider-agnostic abstraction that routes prompts to configured LLM providers (default: OpenAI GPT-4o-mini)
- **Product_Catalog**: The database of available products with metadata including category, price, and description
- **Generated_Cart**: A complete shopping cart produced by the system from a situational input, containing products, quantities, and reasoning
- **User**: A person interacting with the platform to fulfill a shopping need
- **Session**: A single interaction lifecycle from need description through cart approval or modification

## Requirements

### Requirement 1: Situational Input Capture

**User Story:** As a User, I want to describe my situation or need in natural language, so that the system understands what I need without manual product searching.

#### Acceptance Criteria

1. THE Situational_Commerce_Engine SHALL provide a text input field that accepts natural language descriptions of situations up to 500 characters.
2. WHEN the User submits a situational description, THE Intent_Parser SHALL acknowledge receipt within 500ms by displaying a loading state.
3. WHEN the User submits an empty or whitespace-only description, THE Situational_Commerce_Engine SHALL display a validation message requesting a valid input.
4. THE Situational_Commerce_Engine SHALL display example situation prompts to guide first-time Users (e.g., "Movie night for 6", "Camping trip this weekend", "Baby's first birthday party").

### Requirement 2: AI Intent Parsing

**User Story:** As a User, I want the system to understand the context of my situation, so that it generates relevant product recommendations without me specifying individual items.

#### Acceptance Criteria

1. WHEN the Intent_Parser receives a situational description, THE Intent_Parser SHALL extract the occasion type, estimated group size, and relevant constraints from the input.
2. WHEN the Intent_Parser receives a situational description, THE AI_Service_Layer SHALL send a structured prompt to the configured LLM provider and return a parsed intent object.
3. IF the AI_Service_Layer fails to reach the LLM provider, THEN THE Situational_Commerce_Engine SHALL display an error message and offer the User an option to retry.
4. WHEN the Intent_Parser processes a description, THE Intent_Parser SHALL complete parsing within 5 seconds.

### Requirement 3: Cart Generation from Intent

**User Story:** As a User, I want to receive a complete shopping cart based on my described situation, so that I can review and approve items without building a cart manually.

#### Acceptance Criteria

1. WHEN the Intent_Parser produces a parsed intent, THE Cart_Generator SHALL produce a Generated_Cart containing between 3 and 20 product items with quantities appropriate to the parsed context.
2. THE Cart_Generator SHALL include a brief reasoning explanation for each product in the Generated_Cart, describing why the item is relevant to the situation.
3. WHEN the Cart_Generator produces a Generated_Cart, THE Situational_Commerce_Engine SHALL display each item with its name, quantity, estimated price, and reasoning.
4. THE Cart_Generator SHALL organize Generated_Cart items into logical categories (e.g., "Food & Drinks", "Supplies", "Entertainment").
5. WHEN the Cart_Generator produces a Generated_Cart, THE Situational_Commerce_Engine SHALL display the total estimated cost of the cart.

### Requirement 4: Cart Review and Modification

**User Story:** As a User, I want to review, modify, and approve the AI-generated cart, so that I maintain control over what I purchase.

#### Acceptance Criteria

1. WHEN a Generated_Cart is displayed, THE Situational_Commerce_Engine SHALL allow the User to remove individual items from the cart.
2. WHEN a Generated_Cart is displayed, THE Situational_Commerce_Engine SHALL allow the User to adjust the quantity of individual items.
3. WHEN a Generated_Cart is displayed, THE Situational_Commerce_Engine SHALL provide an "Approve Cart" action to proceed to checkout.
4. WHEN the User modifies an item quantity or removes an item, THE Situational_Commerce_Engine SHALL update the total estimated cost within 200ms.
5. WHEN a Generated_Cart is displayed, THE Situational_Commerce_Engine SHALL allow the User to regenerate the cart with a modified or new situational description.

### Requirement 5: AI Service Abstraction

**User Story:** As a developer, I want the AI integration to be provider-agnostic, so that the LLM provider can be swapped without changing application logic.

#### Acceptance Criteria

1. THE AI_Service_Layer SHALL expose a unified interface for sending prompts and receiving structured responses, independent of the underlying LLM provider.
2. THE AI_Service_Layer SHALL default to OpenAI GPT-4o-mini as the LLM provider when no alternative is configured.
3. THE AI_Service_Layer SHALL read provider configuration (API key, model name, endpoint) from environment variables.
4. IF the AI_Service_Layer receives an invalid or missing API key, THEN THE AI_Service_Layer SHALL return a descriptive error indicating the configuration issue.
5. WHEN the LLM provider is changed, THE AI_Service_Layer SHALL require modifications only to provider configuration and the provider implementation class, without requiring changes to any service logic, API routes, or UI components.

### Requirement 6: Predictive Smart Cart

**User Story:** As a returning User, I want the system to suggest items I regularly purchase and may need to replenish, so that I do not forget recurring essentials.

#### Acceptance Criteria

1. WHEN a User has at least 2 prior Sessions with approved carts, THE Smart_Cart SHALL generate replenishment recommendations based on previously approved items.
2. THE Smart_Cart SHALL display recommendations as a separate section from the situational Generated_Cart.
3. WHEN the Smart_Cart displays recommendations, THE Situational_Commerce_Engine SHALL allow the User to add individual recommended items to the current cart.
4. THE Smart_Cart SHALL limit recommendations to a maximum of 5 items per Session.
5. IF the User has no prior purchase history, THEN THE Smart_Cart SHALL not display the recommendations section.

### Requirement 7: Voice Shopping Input

**User Story:** As a User, I want to describe my situation using voice, so that I can interact with the platform hands-free.

#### Acceptance Criteria

1. THE Voice_Interface SHALL provide a microphone activation button on the main input screen.
2. WHEN the User activates the microphone, THE Voice_Interface SHALL use the Web Speech API to capture and transcribe spoken input to text.
3. WHEN the Voice_Interface produces a transcription, THE Voice_Interface SHALL populate the situational input field with the transcribed text for User review before submission.
4. IF the Web Speech API is not supported by the User's browser, THEN THE Voice_Interface SHALL hide the microphone button and rely on text input only.
5. IF the Voice_Interface fails to capture audio or produce a transcription, THEN THE Voice_Interface SHALL display an error message and allow the User to retry or use text input.

### Requirement 8: Data Persistence

**User Story:** As a User, I want my sessions and approved carts to be saved, so that the system can learn my preferences over time.

#### Acceptance Criteria

1. WHEN the User approves a Generated_Cart, THE Situational_Commerce_Engine SHALL persist the Session data including the original description, parsed intent, and approved cart items to the database.
2. THE Situational_Commerce_Engine SHALL use Prisma ORM for all database interactions.
3. THE Situational_Commerce_Engine SHALL use PostgreSQL hosted on Supabase for all environments through Prisma configuration.
4. WHEN a Session is persisted, THE Situational_Commerce_Engine SHALL store a timestamp, the situational description, and the list of approved items with quantities.

### Requirement 9: Responsive User Interface

**User Story:** As a User, I want the interface to work smoothly on desktop and mobile browsers, so that I can use the platform from any device during the demo.

#### Acceptance Criteria

1. THE Situational_Commerce_Engine SHALL render a usable layout on viewport widths from 375px to 1920px.
2. THE Situational_Commerce_Engine SHALL use Tailwind CSS for all styling.
3. WHEN the AI_Service_Layer is processing a request, THE Situational_Commerce_Engine SHALL display a visible loading indicator to communicate progress to the User.
4. THE Situational_Commerce_Engine SHALL use Next.js App Router for page routing and API route handling.

### Requirement 10: Extensible Architecture

**User Story:** As a developer, I want the architecture to support future features without requiring rewrites, so that the demo tells a compelling expansion story.

#### Acceptance Criteria

1. THE Situational_Commerce_Engine SHALL organize code into distinct layers: UI components, API routes, service logic, and data access.
2. THE AI_Service_Layer SHALL accept additional context parameters (e.g., weather, calendar events, household profile) without requiring interface changes.
3. THE Situational_Commerce_Engine SHALL define TypeScript interfaces for all data structures exchanged between layers.
4. THE Situational_Commerce_Engine SHALL use environment variables for all external service configuration.
