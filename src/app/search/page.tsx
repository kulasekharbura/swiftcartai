'use client';

import { ProductCatalog } from '../components/ProductCatalog';
import { useCart } from '../providers/CartProvider';
import { Product } from '@/types/index';

export default function SearchPage() {
  const { items, addItem } = useCart();
  const cartItemNames = new Set(items.map(i => i.productName.toLowerCase()));

  const handleAddProduct = (product: Product) => {
    addItem({
      productName: product.name,
      quantity: 1,
      estimatedPrice: product.price,
      reasoning: 'Added from search',
      category: product.category,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#131A22] mb-6">Search Products</h1>
      <ProductCatalog onAddToCart={handleAddProduct} cartItemNames={cartItemNames} />
    </div>
  );
}
