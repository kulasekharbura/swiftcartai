'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../../providers/CartProvider';
import { ForgotSomething } from '../../components/ForgotSomething';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, Minus, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '@/types/index';
import cuid from 'cuid';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { items, computeTotal, itemCount, lastDescription, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const [showForgot, setShowForgot] = useState(true);
  const [addedAfterItems, setAddedAfterItems] = useState<CartItem[]>([]);
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [showFullCart, setShowFullCart] = useState(false);

  const handleStartNew = () => {
    clearCart();
    router.push('/');
  };

  const handleConfirmOrder = () => {
    setOrderFinalized(true);
    setShowForgot(false);
  };

  const handleAddAfterItem = (name: string, price: number) => {
    const id = cuid();
    addItem({
      productName: name,
      quantity: 1,
      estimatedPrice: price,
      reasoning: 'Added after order',
      category: 'Last Minute',
    });
    setAddedAfterItems(prev => [...prev, {
      id,
      productName: name,
      quantity: 1,
      estimatedPrice: price,
      reasoning: 'Added after order',
      category: 'Last Minute',
    }]);
  };

  const handleRemoveAfterItem = (id: string) => {
    removeItem(id);
    setAddedAfterItems(prev => prev.filter(i => i.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
    setAddedAfterItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const afterItemsTotal = addedAfterItems.reduce((sum, i) => sum + i.estimatedPrice * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Success card */}
      <Card className="border-t-4 border-t-[#067D62] mb-6">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-[#067D62] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#131A22] mb-2">
            {orderFinalized ? 'Order Confirmed!' : 'Order Placed!'}
          </h1>
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
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#067D62] mb-6">
            <Package className="h-3.5 w-3.5" />
            <span>Your preferences have been saved for smarter recommendations</span>
          </div>

          <Button onClick={handleStartNew} size="lg">Start New Order</Button>
        </CardContent>
      </Card>

      {/* Full Cart View (collapsible) */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <button
            onClick={() => setShowFullCart(!showFullCart)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F7F8FA] transition-colors"
          >
            <span className="text-sm font-semibold text-[#131A22]">
              View Complete Order ({itemCount} items · ₹{computeTotal().toLocaleString('en-IN')})
            </span>
            {showFullCart ? <ChevronUp className="h-4 w-4 text-[#565959]" /> : <ChevronDown className="h-4 w-4 text-[#565959]" />}
          </button>
          {showFullCart && (
            <div className="border-t border-[#D5D9D9] px-4 py-3 max-h-80 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#D5D9D9]/50 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#131A22] truncate">{item.productName}</p>
                    <p className="text-xs text-[#565959]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-[#131A22] ml-2">
                    ₹{(item.estimatedPrice * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 mt-2 border-t border-[#D5D9D9]">
                <span className="text-sm font-bold text-[#131A22]">Order Total</span>
                <span className="text-sm font-bold text-[#131A22]">₹{computeTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Added After Items - Detailed View */}
      {addedAfterItems.length > 0 && !orderFinalized && (
        <Card className="mb-6 border-[#FF9900]/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#131A22]">
                Added to order ({addedAfterItems.length} item{addedAfterItems.length !== 1 ? 's' : ''})
              </h3>
              <span className="text-sm font-bold text-[#131A22]">+₹{afterItemsTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="space-y-2">
              {addedAfterItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#D5D9D9] last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#131A22] truncate">{item.productName}</p>
                    <p className="text-xs text-[#565959]">₹{item.estimatedPrice} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#D5D9D9] rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                        className="h-7 w-7 flex items-center justify-center text-[#565959] hover:bg-[#F7F8FA]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-medium text-[#131A22] min-w-[1.5rem] text-center border-x border-[#D5D9D9]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-7 w-7 flex items-center justify-center text-[#565959] hover:bg-[#F7F8FA]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Line total */}
                    <span className="text-sm font-bold text-[#131A22] min-w-[3.5rem] text-right">
                      ₹{(item.estimatedPrice * item.quantity).toFixed(0)}
                    </span>
                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveAfterItem(item.id)}
                      className="h-7 w-7 flex items-center justify-center text-[#565959] hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm button */}
            <Button
              className="w-full mt-4"
              onClick={handleConfirmOrder}
            >
              ✓ Confirm Updated Order · ₹{computeTotal().toLocaleString('en-IN')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Forgot Something */}
      {showForgot && !orderFinalized && (
        <ForgotSomething
          onAddItem={handleAddAfterItem}
          onFinalize={() => setShowForgot(false)}
        />
      )}

      {/* Confirm button — always visible when timer is running */}
      {showForgot && !orderFinalized && (
        <div className="mt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={handleConfirmOrder}
          >
            ✓ Confirm & Finalize Order
          </Button>
        </div>
      )}

      {/* Finalized message */}
      {orderFinalized && (
        <Card className="border-t-2 border-t-[#067D62]">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-[#067D62] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#067D62]">Order finalized with all additions</p>
            <p className="text-xs text-[#565959] mt-1">Updated total: ₹{computeTotal().toLocaleString('en-IN')} · {itemCount} items</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
