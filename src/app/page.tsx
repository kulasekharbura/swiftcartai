'use client';

import { useState, useEffect } from 'react';
import { SituationInput } from './components/SituationInput';
import { VoiceButton } from './components/VoiceButton';
import { LoadingState } from './components/LoadingState';
import { ErrorBanner } from './components/ErrorBanner';
import { CartDisplay } from './components/CartDisplay';
import { CartSummary } from './components/CartSummary';
import { SmartCartPanel } from './components/SmartCartPanel';
import { HouseholdProfilePanel } from './components/HouseholdProfile';
import { AIReasoningPanel } from './components/AIReasoningPanel';
import { SessionHistory } from './components/SessionHistory';
import { CartItem, GeneratedCart, SmartCartRecommendation, HouseholdProfile } from '@/types/index';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';
import cuid from 'cuid';

type AppState = 'idle' | 'loading' | 'cart' | 'approved';

export default function Home() {
  const [state, setState] = useState<AppState>('idle');
  const [cart, setCart] = useState<GeneratedCart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastDescription, setLastDescription] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<SmartCartRecommendation[]>([]);
  const [smartCartEligible, setSmartCartEligible] = useState(false);
  const [addedRecommendationIds, setAddedRecommendationIds] = useState<Set<string>>(new Set());
  const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile | null>(null);
  const [currentIntentCategory, setCurrentIntentCategory] = useState<string | null>(null);

  // On mount, read userId from localStorage for session continuity
  useEffect(() => {
    const stored = localStorage.getItem('swiftcart_user_id');
    if (stored) setUserId(stored);
  }, []);

  // Fetch context-aware smart cart recommendations
  const fetchRecommendations = (uid: string, category?: string) => {
    const params = category ? `?category=${category}` : '';
    fetch(`/api/smart-cart/${uid}${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.eligible) {
          setSmartCartEligible(true);
          setRecommendations(data.recommendations);
        } else {
          setSmartCartEligible(false);
          setRecommendations([]);
        }
      })
      .catch(() => {
        // Silently fail — smart cart is not critical
      });
  };

  const computeTotal = (cartItems: CartItem[]): number => {
    return cartItems.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);
  };

  const handleSubmit = async (description: string) => {
    setState('loading');
    setError(null);
    setLastDescription(description);

    try {
      // Build additionalContext from household profile
      const additionalContext: Record<string, unknown> = {};
      if (householdProfile) {
        additionalContext.householdSize = householdProfile.householdSize;
        additionalContext.diet = householdProfile.diet;
        additionalContext.budget = householdProfile.budget;
      }

      // Step 1: Parse intent
      const intentRes = await fetch('/api/parse-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          additionalContext: Object.keys(additionalContext).length > 0 ? additionalContext : undefined,
        }),
      });
      const intentData = await intentRes.json();
      if (!intentData.success) {
        throw new Error(intentData.error || 'Failed to parse intent');
      }

      // Step 2: Generate cart
      const cartRes = await fetch('/api/generate-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: intentData.intent }),
      });
      const cartData = await cartRes.json();
      if (!cartData.success) {
        throw new Error(cartData.error || 'Failed to generate cart');
      }

      setCart(cartData.cart);
      setItems(cartData.cart.items);
      setState('cart');

      // Step 3: Refetch context-aware recommendations based on detected intent category
      const detectedCategory = intentData.intent?.intentCategory;
      setCurrentIntentCategory(detectedCategory || null);
      if (userId && detectedCategory) {
        fetchRecommendations(userId, detectedCategory);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setState('idle');
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRegenerate = () => {
    setState('idle');
    setCart(null);
    setItems([]);
    setError(null);
    setInputValue('');
  };

  const handleApprove = async () => {
    if (!cart) return;
    setIsApproving(true);
    setError(null);

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || undefined,
          description: lastDescription,
          parsedIntent: cart.parsedIntent,
          approvedItems: items,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save session');
      }

      // Save userId for future sessions
      if (data.userId) {
        localStorage.setItem('swiftcart_user_id', data.userId);
        setUserId(data.userId);
      }

      setState('approved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your cart.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (lastDescription) {
      handleSubmit(lastDescription);
    }
  };

  const handleTranscription = (text: string) => {
    setInputValue(text);
  };

  const handleAddRecommendation = (rec: SmartCartRecommendation) => {
    const newItem: CartItem = {
      id: cuid(),
      productName: rec.productName,
      quantity: rec.quantity,
      estimatedPrice: rec.estimatedPrice,
      reasoning: rec.reason,
      category: 'Recommended',
    };
    setItems(prev => [...prev, newItem]);
    setAddedRecommendationIds(prev => new Set([...prev, rec.id]));
  };

  const handleProfileChange = (profile: HouseholdProfile) => {
    setHouseholdProfile(profile);
  };

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShoppingCart className="h-7 w-7 text-[#FF9900]" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#131A22]">
            SwiftCart
          </h1>
        </div>
        <p className="text-[#565959] text-lg">
          Describe your situation. We&apos;ll build your cart.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 w-full max-w-2xl">
          <ErrorBanner
            message={error}
            onRetry={handleRetry}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {/* State machine rendering */}
      {(state === 'idle' || state === 'loading') && (
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Phase 2: Household Profile */}
          <HouseholdProfilePanel onProfileChange={handleProfileChange} />

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <SituationInput
                onSubmit={handleSubmit}
                isLoading={state === 'loading'}
                value={inputValue}
                onChange={setInputValue}
              />
            </div>
            <div className="pt-6">
              <VoiceButton
                onTranscription={handleTranscription}
                disabled={state === 'loading'}
              />
            </div>
          </div>

          {/* Phase 4: Session History */}
          {state === 'idle' && (
            <SessionHistory userId={userId} />
          )}
        </div>
      )}

      {state === 'loading' && (
        <div className="mt-8 w-full">
          <LoadingState />
        </div>
      )}

      {state === 'cart' && items.length > 0 && (
        <div className="w-full max-w-2xl space-y-6 animate-fade-in-up">
          <div className="text-center mb-4">
            <p className="text-sm text-[#565959]">
              Cart generated for: <span className="font-medium text-[#131A22]">&ldquo;{lastDescription}&rdquo;</span>
            </p>
          </div>

          {/* Phase 3: AI Reasoning Panel */}
          {cart?.cartReasoning && (
            <AIReasoningPanel reasoning={cart.cartReasoning} />
          )}

          {smartCartEligible && recommendations.length > 0 && (
            <SmartCartPanel
              recommendations={recommendations}
              onAdd={handleAddRecommendation}
              addedIds={addedRecommendationIds}
              title={currentIntentCategory ? `Suggested for ${currentIntentCategory} sessions` : undefined}
            />
          )}
          <CartDisplay
            items={items}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
          <CartSummary
            totalCost={computeTotal(items)}
            itemCount={items.length}
            onApprove={handleApprove}
            onRegenerate={handleRegenerate}
            isApproving={isApproving}
          />
        </div>
      )}

      {state === 'cart' && items.length === 0 && (
        <div className="w-full max-w-2xl text-center py-12">
          <p className="text-[#565959] mb-4">All items have been removed from your cart.</p>
          <Button onClick={handleRegenerate} size="lg">
            Start Over
          </Button>
        </div>
      )}

      {/* Approved state */}
      {state === 'approved' && (
        <ApprovedState
          description={lastDescription}
          itemCount={items.length}
          totalCost={computeTotal(items)}
          onStartNew={handleRegenerate}
        />
      )}
    </main>
  );
}

/* Professional success screen */
function ApprovedState({
  description,
  itemCount,
  totalCost,
  onStartNew,
}: {
  description: string;
  itemCount: number;
  totalCost: number;
  onStartNew: () => void;
}) {
  return (
    <div className="w-full max-w-2xl text-center py-12">
      <div className="animate-bounce-in">
        <Card className="border-t-4 border-t-[#067D62]">
          <CardContent className="p-8">
            <CheckCircle2 className="h-14 w-14 text-[#067D62] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#131A22] mb-2">Cart Approved</h2>
            <p className="text-[#565959] mb-1">Your items are ready for checkout.</p>
            <p className="text-sm text-[#565959] mb-6">
              &ldquo;{description}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#131A22]">₹{totalCost.toLocaleString('en-IN')}</p>
                <p className="text-xs text-[#565959]">Total</p>
              </div>
              <div className="w-px h-10 bg-[#D5D9D9]" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#131A22]">{itemCount}</p>
                <p className="text-xs text-[#565959]">Items ordered</p>
              </div>
            </div>

            <p className="text-xs text-[#067D62] mb-6 flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Your preferences have been saved
            </p>

            <Button onClick={onStartNew} size="lg">
              Start New Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
