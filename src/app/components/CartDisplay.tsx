'use client';

import { CartItem as CartItemType } from '@/types/index';
import { CartItem } from './CartItem';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CartDisplayProps {
  items: CartItemType[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onSwap?: (id: string, newName: string, newPrice: number) => void;
  intentLabels?: string[];
}

export function CartDisplay({ items, onQuantityChange, onRemove, onSwap, intentLabels }: CartDisplayProps) {
  // Group items by category
  const groupedItems = items.reduce<Record<string, CartItemType[]>>((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);

  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-8">
        <p className="text-[#565959]">No items in cart.</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-5 space-y-5">
        {intentLabels && intentLabels.length > 1 && (
          <div className="mb-4 p-3 bg-[#F7F8FA] rounded-lg border border-[#D5D9D9]">
            <p className="text-xs font-medium text-[#565959] mb-2">Detected Intents:</p>
            <div className="flex flex-wrap gap-2">
              {intentLabels.map((label, idx) => (
                <Badge key={idx} variant="default">{label}</Badge>
              ))}
            </div>
          </div>
        )}
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-2.5">
              <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                {category}
              </Badge>
              <span className="text-xs text-[#565959]">({groupedItems[category].length})</span>
            </div>
            <div>
              {groupedItems[category].map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={onQuantityChange}
                  onRemove={onRemove}
                  onSwap={onSwap}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
