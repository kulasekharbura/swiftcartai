'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check } from 'lucide-react';

interface CartSummaryProps {
  totalCost: number;
  itemCount: number;
  onApprove: () => void;
  onRegenerate: () => void;
  isApproving?: boolean;
}

export function CartSummary({ totalCost, itemCount, onApprove, onRegenerate, isApproving }: CartSummaryProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-5">
          {/* Summary row */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-sm text-[#565959]">
                Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#131A22]">₹{totalCost.toFixed(0)}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={isApproving}
              className="flex-1 h-11"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            <Button
              onClick={onApprove}
              disabled={isApproving}
              className="flex-1 h-11"
            >
              <Check className="h-4 w-4 mr-2" />
              {isApproving ? 'Saving...' : 'Approve Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
