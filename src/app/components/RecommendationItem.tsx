'use client';

import { SmartCartRecommendation } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';

interface RecommendationItemProps {
  recommendation: SmartCartRecommendation;
  onAdd: (recommendation: SmartCartRecommendation) => void;
  isAdded?: boolean;
}

export function RecommendationItem({ recommendation, onAdd, isAdded }: RecommendationItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-[#D5D9D9] hover:border-[#FF9900]/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#131A22] text-sm truncate">{recommendation.productName}</p>
        <p className="text-xs text-[#565959] mt-0.5">{recommendation.reason}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm text-[#131A22] font-medium">₹{recommendation.estimatedPrice}</span>
        <Button
          size="sm"
          variant={isAdded ? "secondary" : "default"}
          onClick={() => onAdd(recommendation)}
          disabled={isAdded}
          className={isAdded ? "bg-[#E7F7E7] text-[#067D62] hover:bg-[#E7F7E7] border-[#067D62]/20" : ""}
        >
          {isAdded ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
