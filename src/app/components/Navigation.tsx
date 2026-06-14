'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../providers/CartProvider';

export function Navigation() {
  const pathname = usePathname();
  const { itemCount, computeTotal } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#D5D9D9]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-[#FF9900]" />
          <span className="text-lg font-bold text-[#131A22]">SwiftCart</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm ${pathname === '/' ? 'text-[#131A22] font-medium' : 'text-[#565959] hover:text-[#131A22]'}`}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={`text-sm ${pathname === '/search' ? 'text-[#131A22] font-medium' : 'text-[#565959] hover:text-[#131A22]'}`}
          >
            Search
          </Link>
        </nav>

        {/* Cart indicator */}
        <Link href="/cart" className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F7F8FA] transition-colors">
          <ShoppingCart className="h-5 w-5 text-[#131A22]" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF9900] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
          {itemCount > 0 && (
            <span className="hidden sm:inline text-sm text-[#131A22] font-medium">
              ₹{computeTotal().toLocaleString('en-IN')}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
