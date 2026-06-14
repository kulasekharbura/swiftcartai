'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SituationInput } from './components/SituationInput';
import { VoiceButton } from './components/VoiceButton';
import { LoadingState } from './components/LoadingState';
import { ErrorBanner } from './components/ErrorBanner';
import { HouseholdProfilePanel } from './components/HouseholdProfile';
import { SessionHistory } from './components/SessionHistory';
import { ProductCatalog } from './components/ProductCatalog';
import { useCart } from './providers/CartProvider';
import { Product } from '@/types/index';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { addItem, setCart, setItems, setIntentLabels, setLastDescription, userId, householdProfile, setHouseholdProfile, items, intentLabels: existingLabels } = useCart();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cartItemNames = new Set(items.map(i => i.productName.toLowerCase()));

  const handleSubmit = async (description: string) => {
    setIsLoading(true);
    setError(null);
    setLastDescription(description);

    try {
      const additionalContext: Record<string, unknown> = {};
      if (householdProfile) {
        additionalContext.householdSize = householdProfile.householdSize;
        additionalContext.diet = householdProfile.diet;
        additionalContext.budget = householdProfile.budget;
      }

      const res = await fetch('/api/generate-multi-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          additionalContext: Object.keys(additionalContext).length > 0 ? additionalContext : undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to generate cart');

      setCart(data.cart);
      
      // MERGE: append new items to existing cart (don't replace)
      const newItems = data.cart.items;
      if (items.length > 0) {
        // Merge: combine duplicates by product name
        const merged = [...items];
        for (const newItem of newItems) {
          const existingIndex = merged.findIndex(
            i => i.productName.toLowerCase() === newItem.productName.toLowerCase()
          );
          if (existingIndex >= 0) {
            // Duplicate found — add quantities
            merged[existingIndex] = {
              ...merged[existingIndex],
              quantity: merged[existingIndex].quantity + newItem.quantity,
            };
          } else {
            merged.push(newItem);
          }
        }
        setItems(merged);
      } else {
        setItems(newItems);
      }
      
      // Append new intent labels to existing ones
      const newLabels = data.intentLabels || [];
      const combinedLabels = [...existingLabels, ...newLabels.filter((l: string) => !existingLabels.includes(l))];
      setIntentLabels(combinedLabels);

      // Navigate to cart page
      router.push('/cart');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setIsLoading(false);
    }
  };

  const handleAddProduct = (product: Product) => {
    addItem({
      productName: product.name,
      quantity: 1,
      estimatedPrice: product.price,
      reasoning: 'Manually added',
      category: product.category,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      {/* AI Section — Hero */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-[#FF9900]" />
          <h2 className="text-xl font-bold text-[#131A22]">AI Shopping Assistant</h2>
        </div>

        <HouseholdProfilePanel onProfileChange={setHouseholdProfile} />

        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} onRetry={() => { if (inputValue) handleSubmit(inputValue); }} onDismiss={() => setError(null)} />
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <SituationInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              value={inputValue}
              onChange={setInputValue}
            />
          </div>
          <div className="pt-6">
            <VoiceButton onTranscription={setInputValue} disabled={isLoading} />
          </div>
        </div>

        {isLoading && <div className="mt-6"><LoadingState /></div>}
      </section>

      {/* Divider */}
      <div className="border-t border-[#D5D9D9] my-6" />

      {/* Browse Section */}
      <section>
        <h2 className="text-xl font-bold text-[#131A22] mb-4">🛒 Browse Products</h2>
        <ProductCatalog onAddToCart={handleAddProduct} cartItemNames={cartItemNames} />
      </section>

      {/* Session History */}
      <section className="mt-8">
        <SessionHistory userId={userId} />
      </section>
    </div>
  );
}
