'use client';

import { CartItem as CartItemType } from '@/types/index';
import { CartItem } from './CartItem';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CartDisplayProps {
  items: CartItemType[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartDisplay({ items, onQuantityChange, onRemove }: CartDisplayProps) {
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
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
