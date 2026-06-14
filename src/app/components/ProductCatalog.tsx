'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Product } from '@/types/index';

const CATEGORIES = [
  { name: 'All', emoji: '🏪' },
  { name: 'Food & Drinks', emoji: '🥛' },
  { name: 'Snacks', emoji: '🍪' },
  { name: 'Beverages', emoji: '🥤' },
  { name: 'Household', emoji: '🧹' },
  { name: 'Personal Care', emoji: '🧴' },
  { name: 'Supplies', emoji: '📦' },
  { name: 'Entertainment', emoji: '🎮' },
];

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  cartItemNames: Set<string>;
}

export function ProductCatalog({ onAddToCart, cartItemNames }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async (category?: string, search?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearch = () => {
    fetchProducts(selectedCategory, searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#565959]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#D5D9D9] rounded-lg text-sm text-[#131A22] placeholder:text-[#565959] focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]/20"
          />
        </div>
        <Button onClick={handleSearch} variant="outline">Search</Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              selectedCategory === cat.name
                ? 'bg-[#131A22] text-white border-[#131A22]'
                : 'bg-white text-[#565959] border-[#D5D9D9] hover:border-[#FF9900]'
            }`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="text-center py-8 text-[#565959] text-sm">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-[#565959] text-sm">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((product) => {
            const inCart = cartItemNames.has(product.name.toLowerCase());
            return (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#131A22] truncate">{product.name}</p>
                    <p className="text-xs text-[#565959] truncate">{product.description}</p>
                    <p className="text-sm font-bold text-[#131A22] mt-1">₹{product.price}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={inCart ? 'secondary' : 'default'}
                    onClick={() => onAddToCart(product)}
                    disabled={inCart}
                    className="flex-shrink-0"
                  >
                    {inCart ? '✓ Added' : <><Plus className="h-3 w-3 mr-1" /> Add</>}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
