import { prisma } from './prisma';
import { CartItem, ParsedIntent } from '@/types/index';

interface CreateSessionInput {
  userId: string;
  description: string;
  parsedIntent: ParsedIntent;
  approvedItems: CartItem[];
}

export async function createSession(input: CreateSessionInput) {
  return prisma.session.create({
    data: {
      userId: input.userId,
      description: input.description,
      parsedIntent: JSON.stringify(input.parsedIntent),
      approvedItems: {
        create: input.approvedItems.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          estimatedPrice: item.estimatedPrice,
          category: item.category,
          reasoning: item.reasoning,
        })),
      },
    },
    include: {
      approvedItems: true,
    },
  });
}

export async function findSessionsByUserId(userId: string) {
  return prisma.session.findMany({
    where: { userId },
    include: { approvedItems: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function countSessionsByUserId(userId: string): Promise<number> {
  return prisma.session.count({ where: { userId } });
}
