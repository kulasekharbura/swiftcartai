import { NextResponse } from 'next/server';
import { findAllProducts, findProductsByCategory, searchProducts } from '@/data/product-repo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let products;

    if (search) {
      products = await searchProducts(search);
    } else if (category) {
      products = await findProductsByCategory(category);
    } else {
      products = await findAllProducts();
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
