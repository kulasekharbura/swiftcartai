'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-5 space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Skeleton cart items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-[#D5D9D9]"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}

          {/* Skeleton total */}
          <div className="flex justify-between items-center pt-4 border-t border-[#D5D9D9]">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 mt-5">
        <Loader2 className="h-4 w-4 text-[#FF9900] animate-spin" />
        <p className="text-sm text-[#565959]">
          AI is curating your perfect cart...
        </p>
      </div>
    </div>
  );
}
