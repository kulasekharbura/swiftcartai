import { NextResponse } from 'next/server';
import { findSessionsByUserId } from '@/data/session-repo';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const sessions = await findSessionsByUserId(userId);

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session) => ({
        id: session.id,
        description: session.description,
        createdAt: session.createdAt,
        itemCount: session.approvedItems.length,
        totalCost: session.approvedItems.reduce(
          (sum, item) => sum + item.estimatedPrice * item.quantity,
          0
        ),
      })),
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
