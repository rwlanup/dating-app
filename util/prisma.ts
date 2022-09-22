import { Prisma } from '@prisma/client';

export const isPrismaError = (error: any): boolean => {
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;
  if (error instanceof Prisma.PrismaClientValidationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) return true;
  if (error instanceof Prisma.PrismaClientUnknownRequestError) return true;
  if (error instanceof Prisma.PrismaClientInitializationError) return true;

  return false;
};
