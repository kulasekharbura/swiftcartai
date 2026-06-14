'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Search } from 'lucide-react';
import { Product } from '@/types/index';

const QUICK_ADDS = [
  { name: 'Bread', price: 45 },
  { name: 'Milk 500ml', price: 30 },
  { name: 'Eggs (6 Pack)', price: 50 },
  { name: 'Toothpaste', price: 110 },
  { name: 'Butter 100g', price: 55 },
  { name: 'Bananas 6pc', price: 40 },
];

interface ForgotSomethingProps {
  onAddItem: (name: string, price: number) => void;
  onFinalize: () => void;
}

export function ForgotSomething({ onAddItem, onFinalize }: ForgotSomethingProps) {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Defer onFinalize to avoid setState-during-render
          setTimeout(() => onFinalize(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onFinalize]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) setSearchResults(data.products.slice(0, 5));
    } catch { /* ignore */ }
  };

  const handleAdd = (name: string, price: number) => {
    onAddItem(name, price);
    setAddedItems(prev => new Set([...prev, name]));
  };

  if (timeLeft === 0) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto border-[#FF9900]/30 bg-[#FFF9F0]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#FF9900]" />
            <h3 className="text-sm font-semibold text-[#131A22]">Forgot something?</h3>
          </div>
          <Badge variant="default" className="font-mono">
            {formatTime(timeLeft)} remaining
          </Badge>
        </div>

        <p className="text-xs text-[#565959] mb-3">Add items to your order before it&apos;s finalized.</p>

        {/* Search */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a product..."
            className="flex-1 px-3 py-2 border border-[#D5D9D9] rounded-md text-sm focus:outline-none focus:border-[#FF9900]"
          />
          <Button size="sm" variant="outline" onClick={handleSearch}>
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {searchResults.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-2 py-1.5 bg-white rounded border border-[#D5D9D9]">
                <span className="text-xs text-[#131A22]">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">₹{p.price}</span>
                  <Button
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    disabled={addedItems.has(p.name)}
                    onClick={() => handleAdd(p.name, p.price)}
                  >
                    {addedItems.has(p.name) ? '✓' : <Plus className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick adds */}
        <p className="text-xs text-[#565959] mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ADDS.map((item) => (
            <button
              key={item.name}
              onClick={() => handleAdd(item.name, item.price)}
              disabled={addedItems.has(item.name)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                addedItems.has(item.name)
                  ? 'bg-[#E7F7E7] text-[#067D62] border-[#067D62]/20'
                  : 'bg-white text-[#131A22] border-[#D5D9D9] hover:border-[#FF9900]'
              }`}
            >
              {addedItems.has(item.name) ? '✓ ' : '+ '}{item.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
