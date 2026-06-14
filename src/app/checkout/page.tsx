'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, computeTotal, itemCount, lastDescription, userId, setUserId, cart } = useCart();
  const [isPlacing, setIsPlacing] = useState(false);

  const deliveryFee = computeTotal() > 499 ? 0 : 30;
  const total = computeTotal() + deliveryFee;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) router.push('/cart');
  }, [items.length, router]);

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || undefined,
          description: lastDescription || 'Manual order',
          parsedIntent: cart?.parsedIntent || { occasionType: 'manual', groupSize: 1, constraints: [], preferences: [], rawDescription: lastDescription || 'Manual order' },
          approvedItems: items,
        }),
      });
      const data = await res.json();
      if (data.userId) setUserId(data.userId);
      router.push('/order/success');
    } catch {
      router.push('/order/success');
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => router.push('/cart')} className="flex items-center gap-1 text-sm text-[#007185] hover:text-[#C7511F] mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </button>

      <h1 className="text-2xl font-bold text-[#131A22] mb-6">Checkout</h1>

      <div className="space-y-4">
        {/* Delivery info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-[#FF9900]" />
              <h3 className="text-sm font-semibold text-[#131A22]">Delivery Address</h3>
            </div>
            <p className="text-sm text-[#565959]">123 Demo Street, Bangalore 560001</p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="h-3.5 w-3.5 text-[#067D62]" />
              <span className="text-xs text-[#067D62] font-medium">Delivery in 10-15 minutes</span>
            </div>
          </CardContent>
        </Card>

        {/* Order summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-[#131A22] mb-3">Order Summary</h3>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#565959] truncate flex-1">{item.productName} × {item.quantity}</span>
                  <span className="text-[#131A22] font-medium ml-2">₹{(item.estimatedPrice * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#D5D9D9] pt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-[#565959]">Subtotal ({itemCount} items)</span>
                <span className="text-[#131A22]">₹{computeTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#565959]">Delivery</span>
                <span className={deliveryFee === 0 ? 'text-[#067D62] font-medium' : 'text-[#131A22]'}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-[#D5D9D9]">
                <span className="text-[#131A22]">Total</span>
                <span className="text-[#131A22]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-[#FF9900]" />
              <h3 className="text-sm font-semibold text-[#131A22]">Payment</h3>
            </div>
            <Badge variant="secondary">Cash on Delivery</Badge>
          </CardContent>
        </Card>

        {/* Place order button */}
        <Button
          size="lg"
          className="w-full"
          onClick={handlePlaceOrder}
          disabled={isPlacing}
        >
          {isPlacing ? 'Placing Order...' : `Place Order · ₹${total.toLocaleString('en-IN')}`}
        </Button>
      </div>
    </div>
  );
}
