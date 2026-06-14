'use client';

import { useState } from 'react';
import { CartItem as CartItemType } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, X } from 'lucide-react';
import { getAlternatives } from '@/services/alternatives';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onSwap?: (id: string, newName: string, newPrice: number) => void;
}

export function CartItem({ item, onQuantityChange, onRemove, onSwap }: CartItemProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const alternatives = getAlternatives(item.productName);

  return (
    <div className="flex flex-col py-3 border-b border-[#D5D9D9] last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[#131A22] truncate">{item.productName}</p>
              <p className="text-xs text-[#565959] mt-0.5 line-clamp-2 sm:line-clamp-1">{item.reasoning}</p>
              {alternatives.length > 0 && (
                <button
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className="text-xs text-[#007185] hover:text-[#C7511F] mt-1 hover:underline"
                >
                  ↔ Alternatives
                </button>
              )}
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

      {/* Alternatives section */}
      {showAlternatives && alternatives.length > 0 && (
        <div className="mt-2 pl-2 border-l-2 border-[#FF9900]/30 space-y-1.5">
          <p className="text-xs font-medium text-[#565959]">Alternatives:</p>
          {alternatives.map((alt, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-[#131A22]">{alt.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{alt.type}</Badge>
                <span className="text-[#131A22] font-medium">₹{alt.price}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] px-2"
                  onClick={() => {
                    onSwap?.(item.id, alt.name, alt.price);
                    setShowAlternatives(false);
                  }}
                >
                  Swap
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
