import { NextResponse } from 'next/server';
import { HybridCartGenerator } from '@/services/hybrid-cart-generator';
import { ValidationError, AIServiceError, AIConfigError } from '@/services/errors';
import type { GenerateCartRequest, GenerateCartResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    let body: GenerateCartRequest;
    try {
      body = (await request.json()) as GenerateCartRequest;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body.' } satisfies GenerateCartResponse,
        { status: 400 }
      );
    }

    const { intent } = body;

    // Validate intent structure
    if (!intent || !intent.occasionType || typeof intent.occasionType !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid intent: occasionType is required.' } satisfies GenerateCartResponse,
        { status: 400 }
      );
    }
    if (!intent.groupSize || typeof intent.groupSize !== 'number' || intent.groupSize < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid intent: groupSize must be >= 1.' } satisfies GenerateCartResponse,
        { status: 400 }
      );
    }

    const generator = new HybridCartGenerator();
    const cart = await generator.generate(intent);

    const response: GenerateCartResponse = {
      success: true,
      cart,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message } satisfies GenerateCartResponse,
        { status: 400 }
      );
    }
    if (error instanceof AIConfigError) {
      return NextResponse.json(
        { success: false, error: error.message } satisfies GenerateCartResponse,
        { status: 500 }
      );
    }
    if (error instanceof AIServiceError) {
      return NextResponse.json(
        { success: false, error: error.message } satisfies GenerateCartResponse,
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies GenerateCartResponse,
      { status: 500 }
    );
  }
}
