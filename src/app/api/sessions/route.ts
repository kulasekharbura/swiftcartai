import { NextResponse } from 'next/server';
import { createSession } from '@/data/session-repo';
import { findOrCreateUser } from '@/data/user-repo';
import type { SessionCreateRequest } from '@/types/api';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { userId, description, parsedIntent, approvedItems } =
      body as SessionCreateRequest;

    // Validation
    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { success: false, error: 'description is required' },
        { status: 400 }
      );
    }
    if (!parsedIntent || !parsedIntent.occasionType) {
      return NextResponse.json(
        { success: false, error: 'parsedIntent is required' },
        { status: 400 }
      );
    }
    if (
      !approvedItems ||
      !Array.isArray(approvedItems) ||
      approvedItems.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'approvedItems must be a non-empty array' },
        { status: 400 }
      );
    }

    // Ensure user exists
    const user = await findOrCreateUser(userId);

    // Create session
    const session = await createSession({
      userId: user.id,
      description,
      parsedIntent,
      approvedItems,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      userId: user.id,
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save session' },
      { status: 500 }
    );
  }
}
