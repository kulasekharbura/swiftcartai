'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border border-[#D5D9D9] border-l-4 border-l-red-600 bg-white rounded-lg p-4">
        <div role="alert" className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-[#131A22]">{message}</p>
            <div className="flex gap-3 mt-3">
              {onRetry && (
                <Button variant="link" onClick={onRetry} className="h-auto p-0 text-sm">
                  Try again
                </Button>
              )}
              {onDismiss && (
                <Button variant="ghost" onClick={onDismiss} className="h-auto p-0 text-sm">
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
