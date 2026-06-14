import { prisma } from './prisma';

export async function findOrCreateUser(userId?: string) {
  if (userId) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (existing) return existing;
  }
  return prisma.user.create({ data: {} });
}

export async function findUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}
