import { prisma } from './prisma';

export async function findAllProducts() {
  return prisma.product.findMany({
    where: { inStock: true },
    orderBy: { category: 'asc' },
  });
}

export async function findProductsByCategory(category: string) {
  return prisma.product.findMany({
    where: { category, inStock: true },
    orderBy: { name: 'asc' },
  });
}

export async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      inStock: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
  });
}
