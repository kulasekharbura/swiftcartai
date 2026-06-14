'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface SituationInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
}

const EXAMPLE_PROMPTS = [
  'Movie night for 6 people',
  'Guests arriving tonight for dinner',
  'Making biryani for the family',
  'Weekend camping trip with friends',
  "Baby's first birthday party",
  'Late night study session',
];

export function SituationInput({ onSubmit, isLoading, value, onChange }: SituationInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!value.trim()) {
      setError('Please describe your situation. The input cannot be empty.');
      return;
    }
    if (value.length > 500) {
      setError('Description must be 500 characters or fewer.');
      return;
    }

    onSubmit(value);
  };

  const handleExampleClick = (prompt: string) => {
    onChange(prompt);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="situation-input"
                className="block text-sm font-medium text-[#131A22] mb-2"
              >
                Describe your situation
              </label>
              <Textarea
                id="situation-input"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="What's the occasion? Tell us what you need..."
                maxLength={500}
                rows={3}
                disabled={isLoading}
                className="text-base"
                aria-describedby="char-count input-error"
              />
              <div className="flex justify-between items-center mt-1.5">
                {error && (
                  <p id="input-error" className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}
                <p
                  id="char-count"
                  className="text-xs text-[#565959] ml-auto"
                  aria-live="polite"
                >
                  {value.length}/500
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !value.trim()}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating your cart...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Smart Cart
                </span>
              )}
            </Button>
          </form>

          {/* Example prompts */}
          <div className="mt-5 pt-4 border-t border-[#D5D9D9]">
            <p className="text-sm text-[#565959] mb-2.5">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleExampleClick(prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#F7F8FA] text-[#565959] border border-[#D5D9D9] hover:border-[#FF9900] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
