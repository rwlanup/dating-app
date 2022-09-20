import { Interest } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { popularInterestSchema } from '../../common/validation/interests/popular';
import { updateInterestsSchema } from '../../common/validation/interests/update';
import { DataWithSuccessMessage } from '../../types/server';
import { createRouter } from '../createRouter';

export const interestsRouter = createRouter()
  .mutation('update', {
    input: updateInterestsSchema,
    resolve: async ({ input, ctx: { prisma, session } }): Promise<DataWithSuccessMessage> => {
      if (!session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not logged in, please log in to update your profile.',
        });
      }

      await prisma.user.update({
        select: {
          id: true,
        },
        where: {
          id: session.user.id,
        },
        data: {
          interests: {
            deleteMany: {},
            create: input.interests.map((interest) => ({
              interest: {
                connectOrCreate: {
                  where: {
                    name: interest,
                  },
                  create: {
                    name: interest,
                  },
                },
              },
            })),
          },
        },
      });

      return {
        message: 'Your interests has been updated successfully.',
        status: 201,
      };
    },
  })

  .query('popular', {
    input: popularInterestSchema,
    resolve: async ({ input, ctx: { prisma } }): Promise<Interest[]> => {
      return await prisma.interest.findMany({
        where: {
          name: {
            contains: input || '',
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
        },
        take: 10,
        orderBy: {
          users: {
            _count: 'desc',
          },
        },
      });
    },
  })

  .query('mine', {
    resolve: async ({ ctx: { prisma, session } }): Promise<Interest[]> => {
      if (!session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not logged in, please log in to update your profile.',
        });
      }

      return await prisma.interest.findMany({
        where: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
      });
    },
  });
