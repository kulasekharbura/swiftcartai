import { getSmartCartRecommendations } from '@/services/smart-cart';
import { IntentCategory } from '@/services/templates/templates';

const VALID_CATEGORIES: IntentCategory[] = ['recipe', 'event', 'restocking', 'emergency', 'snack', 'general'];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return Response.json(
        { success: false, recommendations: [], eligible: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Extract optional intentCategory from query params
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category') as IntentCategory | null;
    const intentCategory = categoryParam && VALID_CATEGORIES.includes(categoryParam)
      ? categoryParam
      : undefined;

    const result = await getSmartCartRecommendations(userId, intentCategory);

    return Response.json({
      success: true,
      eligible: result.eligible,
      recommendations: result.recommendations,
      source: result.source,
    });
  } catch (error) {
    console.error('Smart cart error:', error);
    return Response.json(
      { success: false, recommendations: [], eligible: false, error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
