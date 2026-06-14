'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import { CartDisplay } from '../components/CartDisplay';
import { AIReasoningPanel } from '../components/AIReasoningPanel';
import { SmartCartPanel } from '../components/SmartCartPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SmartCartRecommendation } from '@/types/index';

export default function CartPage() {
  const router = useRouter();
  const { items, cart, intentLabels, updateQuantity, removeItem, swapItem, computeTotal, itemCount, userId, addItem } = useCart();
  const [recommendations, setRecommendations] = useState<SmartCartRecommendation[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    const category = cart?.parsedIntent?.intentCategory;
    const params = category ? `?category=${category}` : '';
    fetch(`/api/smart-cart/${userId}${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.eligible) setRecommendations(data.recommendations);
      })
      .catch(() => {});
  }, [userId, cart]);

  const handleAddRecommendation = (rec: SmartCartRecommendation) => {
    addItem({
      productName: rec.productName,
      quantity: rec.quantity,
      estimatedPrice: rec.estimatedPrice,
      reasoning: rec.reason,
      category: 'Recommended',
    });
    setAddedIds(prev => new Set([...prev, rec.id]));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-[#D5D9D9] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#131A22] mb-2">Your cart is empty</h2>
        <p className="text-[#565959] mb-6">Start shopping with AI or browse products</p>
        <Button onClick={() => router.push('/')} size="lg">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back */}
      <button onClick={() => router.push('/')} className="flex items-center gap-1 text-sm text-[#007185] hover:text-[#C7511F] mb-4">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </button>

      <h1 className="text-2xl font-bold text-[#131A22] mb-6">Shopping Cart</h1>

      {/* AI Reasoning */}
      {cart?.cartReasoning && (
        <div className="mb-6">
          <AIReasoningPanel reasoning={cart.cartReasoning} />
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <SmartCartPanel
            recommendations={recommendations}
            onAdd={handleAddRecommendation}
            addedIds={addedIds}
            title="Recommended for you"
          />
        </div>
      )}

      {/* Cart items */}
      <CartDisplay
        items={items}
        onQuantityChange={updateQuantity}
        onRemove={removeItem}
        onSwap={swapItem}
        intentLabels={intentLabels}
      />

      {/* Summary bar */}
      <Card className="mt-6 sticky bottom-4">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#565959]">Subtotal ({itemCount} items)</p>
            <p className="text-2xl font-bold text-[#131A22]">₹{computeTotal().toLocaleString('en-IN')}</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={() => router.push('/')} className="flex-1 sm:flex-none">
              Add More
            </Button>
            <Button size="lg" onClick={() => router.push('/checkout')} className="flex-1 sm:flex-none">
              Proceed to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
