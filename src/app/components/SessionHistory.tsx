'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, History } from 'lucide-react';

interface SessionSummary {
  id: string;
  description: string;
  createdAt: string;
  itemCount: number;
  totalCost: number;
}

interface SessionHistoryProps {
  userId: string | null;
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function SessionHistory({ userId }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    fetch(`/api/sessions/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessions(data.sessions.slice(0, 5));
        }
      })
      .catch(() => {
        // Silently fail
      })
      .finally(() => {
        setIsLoading(false);
        setHasFetched(true);
      });
  }, [userId]);

  if (!userId || !hasFetched) return null;
  if (sessions.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <Card className="overflow-hidden">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 h-auto rounded-none hover:bg-[#F7F8FA]"
        >
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#565959]" />
            <span className="text-sm font-medium text-[#131A22]">Recent Sessions</span>
            <Badge variant="secondary">{sessions.length}</Badge>
          </div>
          <ChevronDown className={`h-4 w-4 text-[#565959] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>

        {isExpanded && (
          <CardContent className="p-0 border-t border-[#D5D9D9]">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-[#565959]">Loading...</div>
            ) : (
              <div className="divide-y divide-[#D5D9D9]">
                {sessions.map((session) => (
                  <div key={session.id} className="px-4 py-3 hover:bg-[#F7F8FA] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#131A22] truncate font-medium">
                          {session.description}
                        </p>
                        <p className="text-xs text-[#565959] mt-0.5">
                          {getRelativeTime(session.createdAt)} · {session.itemCount} item{session.itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-[#131A22] ml-3 whitespace-nowrap">
                        ₹{session.totalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
