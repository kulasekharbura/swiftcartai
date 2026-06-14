'use client';

import { SmartCartRecommendation } from '@/types/index';
import { RecommendationItem } from './RecommendationItem';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface SmartCartPanelProps {
  recommendations: SmartCartRecommendation[];
  onAdd: (recommendation: SmartCartRecommendation) => void;
  addedIds: Set<string>;
  title?: string;
}

export function SmartCartPanel({ recommendations, onAdd, addedIds, title }: SmartCartPanelProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#F7F8FA] border border-[#D5D9D9] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-[#007185]" />
          <h3 className="text-sm font-bold text-[#131A22]">{title || 'Recommended for you'}</h3>
          <Badge variant="ai">Based on your history</Badge>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <RecommendationItem
              key={rec.id}
              recommendation={rec}
              onAdd={onAdd}
              isAdded={addedIds.has(rec.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
