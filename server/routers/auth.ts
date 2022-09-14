import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { registerSchema } from '../../common/validation/auth/register';
import { createRouter } from '../createRouter';
import { DataWithSuccessMessage } from '../../types/server';
import { User } from '@prisma/client';

export const authRouter = createRouter().mutation('authRegister', {
  input: registerSchema,
  resolve: async ({ ctx: { prisma }, input }): Promise<DataWithSuccessMessage<{ user: User }>> => {
    const { fullName, password, username } = input;
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with given username already exist. Please log in instead.',
      });
    }

    const hashedPassword = await hash(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
      },
    });

    return {
      message: 'User account created successfully. You can now log in to your account.',
      status: 201,
      user,
    };
  },
});
