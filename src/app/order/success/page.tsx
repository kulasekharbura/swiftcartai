'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../../providers/CartProvider';
import { ForgotSomething } from '../../components/ForgotSomething';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package } from 'lucide-react';
import { useState } from 'react';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { items, computeTotal, itemCount, lastDescription, addItem, clearCart } = useCart();
  const [showForgot, setShowForgot] = useState(true);
  const [addedAfter, setAddedAfter] = useState(0);

  const handleStartNew = () => {
    clearCart();
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Success card */}
      <Card className="border-t-4 border-t-[#067D62] mb-6">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-[#067D62] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#131A22] mb-2">Order Placed!</h1>
          <p className="text-[#565959] mb-1">Your items will arrive in 10-15 minutes</p>
          {lastDescription && (
            <p className="text-sm text-[#565959] italic mb-4">&ldquo;{lastDescription}&rdquo;</p>
          )}

          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#131A22]">₹{computeTotal().toLocaleString('en-IN')}</p>
              <p className="text-xs text-[#565959]">Total</p>
            </div>
            <div className="w-px h-10 bg-[#D5D9D9]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#131A22]">{itemCount}</p>
              <p className="text-xs text-[#565959]">Items</p>
            </div>
            {addedAfter > 0 && (
              <>
                <div className="w-px h-10 bg-[#D5D9D9]" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#067D62]">+{addedAfter}</p>
                  <p className="text-xs text-[#565959]">Added after</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#067D62] mb-6">
            <Package className="h-3.5 w-3.5" />
            <span>Your preferences have been saved for smarter recommendations</span>
          </div>

          <Button onClick={handleStartNew} size="lg">Start New Order</Button>
        </CardContent>
      </Card>

      {/* Forgot Something */}
      {showForgot && (
        <ForgotSomething
          onAddItem={(name, price) => {
            addItem({
              productName: name,
              quantity: 1,
              estimatedPrice: price,
              reasoning: 'Added after order',
              category: 'Last Minute',
            });
            setAddedAfter(prev => prev + 1);
          }}
          onFinalize={() => setShowForgot(false)}
        />
      )}
    </div>
  );
}
