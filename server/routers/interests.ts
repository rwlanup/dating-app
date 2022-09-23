import { Interest } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { Session } from 'next-auth';
import { popularInterestSchema } from '../../common/validation/interests/popular';
import { updateInterestsSchema } from '../../common/validation/interests/update';
import { authMiddleware } from '../../middleware/auth';
import { DataWithSuccessMessage } from '../../types/server';
import { createRouter } from '../createRouter';

export const interestsRouter = createRouter()
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

  .middleware(authMiddleware)
  .mutation('update', {
    input: updateInterestsSchema,
    resolve: async ({ input, ctx: { prisma, session } }): Promise<DataWithSuccessMessage> => {
      const _session = session as Session;

      await prisma.user.update({
        select: {
          id: true,
        },
        where: {
          id: _session.user.id,
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

  .query('mine', {
    resolve: async ({ ctx: { prisma, session } }): Promise<Interest[]> => {
      const _session = session as Session;
      return await prisma.interest.findMany({
        where: {
          users: {
            some: {
              userId: _session.user.id,
            },
          },
        },
      });
    },
  });
