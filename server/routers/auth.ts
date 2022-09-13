import { TRPCError } from '@trpc/server';
import { hash } from 'argon2';
import { registerSchema } from '../../common/validation/auth/register';
import { createRouter } from '../createRouter';
import slugify from 'slugify';
import { DataWithSuccessMessage } from '../../types/server';
import { User } from '@prisma/client';

export const authRouter = createRouter().mutation('authRegister', {
  input: registerSchema,
  resolve: async ({ ctx: { prisma }, input }): Promise<DataWithSuccessMessage<{ user: User }>> => {
    const { fullName, password, email } = input;
    const existingUserByEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUserByEmail) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with given email address already exist. Please log in instead',
      });
    }

    // Generate random slug
    let slug = slugify(fullName);
    const userCountBySlug = await prisma.user.count({
      where: {
        slug: {
          startsWith: slug,
        },
      },
    });

    if (userCountBySlug > 0) {
      slug = `${slug}-${userCountBySlug}`;
    }

    const hashedPassword = await hash(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        isVerified: false,
        slug,
      },
    });

    return {
      message: 'User account created successfully. Please check your email to activate your account',
      status: 201,
      user,
    };
  },
});
