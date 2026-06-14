'use client';

import { CartItem as CartItemType } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-3 border-b border-[#D5D9D9] last:border-b-0">
      {/* Product info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[#131A22] truncate">{item.productName}</p>
            <p className="text-xs text-[#565959] mt-0.5 line-clamp-2 sm:line-clamp-1">{item.reasoning}</p>
          </div>
          {/* Remove button — shown inline on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="sm:hidden h-8 w-8 text-[#565959] hover:text-red-600"
            aria-label={`Remove ${item.productName}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
        {/* Quantity controls */}
        <div className="flex items-center border border-[#D5D9D9] rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
            className="h-9 w-9 sm:h-8 sm:w-8 rounded-none hover:bg-[#F7F8FA]"
            aria-label={`Decrease quantity of ${item.productName}`}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="px-3 py-1 text-sm font-medium text-[#131A22] min-w-[2rem] text-center border-x border-[#D5D9D9]">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="h-9 w-9 sm:h-8 sm:w-8 rounded-none hover:bg-[#F7F8FA]"
            aria-label={`Increase quantity of ${item.productName}`}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Price (line total) */}
        <span className="text-sm font-bold text-[#131A22] min-w-[4rem] text-right">
          ₹{(item.estimatedPrice * item.quantity).toFixed(0)}
        </span>

        {/* Remove button — desktop only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="hidden sm:flex h-8 w-8 text-[#565959] hover:text-red-600 hover:bg-red-50"
          aria-label={`Remove ${item.productName}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
