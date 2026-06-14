import { NextResponse } from 'next/server';
import { IntentParser } from '@/services/intent-parser';
import { ValidationError, AIServiceError, AIConfigError } from '@/services/errors';
import type { ParseIntentResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' } satisfies ParseIntentResponse,
        { status: 400 }
      );
    }

    const { description, additionalContext } = body as {
      description?: string;
      additionalContext?: Record<string, unknown>;
    };

    if (typeof description !== 'string') {
      return NextResponse.json(
        { success: false, error: 'description is required and must be a string' } satisfies ParseIntentResponse,
        { status: 400 }
      );
    }

    const parser = new IntentParser();
    const intent = await parser.parse(description, additionalContext);

    const response: ParseIntentResponse = {
      success: true,
      intent,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message } satisfies ParseIntentResponse,
        { status: 400 }
      );
    }
    if (error instanceof AIConfigError) {
      return NextResponse.json(
        { success: false, error: error.message } satisfies ParseIntentResponse,
        { status: 500 }
      );
    }
    if (error instanceof AIServiceError) {
      return NextResponse.json(
        { success: false, error: error.message } satisfies ParseIntentResponse,
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies ParseIntentResponse,
      { status: 500 }
    );
  }
}
