'use client';

import { CartReasoning } from '@/types/index';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

interface AIReasoningPanelProps {
  reasoning: CartReasoning;
}

export function AIReasoningPanel({ reasoning }: AIReasoningPanelProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#F7F8FA] border-l-4 border-[#FF9900] rounded-r-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-4 w-4 text-[#131A22]" />
          <h3 className="text-sm font-semibold text-[#131A22]">Why this cart?</h3>
          <Badge variant="outline">
            {reasoning.estimatedBudget} tier
          </Badge>
        </div>
        <p className="text-sm text-[#565959] mb-3">{reasoning.summary}</p>
        <ul className="space-y-1.5">
          {reasoning.keyDecisions.map((decision, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-[#565959]">
              <span className="text-[#FF9900] mt-0.5 font-bold text-sm">•</span>
              <span>{decision}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
