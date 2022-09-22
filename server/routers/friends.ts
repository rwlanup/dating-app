import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ITEMS_PER_REQUEST } from '../../common/config/support';
import { paginationSchema } from '../../common/validation/pagination/pagination';
import { PaginatedProfile } from '../../types/profile';
import { resolveBase64ImageUrl } from '../../util/string';
import { createRouter } from '../createRouter';

export const friendsRouter = createRouter().query('discover', {
  input: paginationSchema,
  resolve: async ({ input, ctx: { prisma, session } }): Promise<PaginatedProfile> => {
    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in, please log in to update your profile.',
      });
    }

    const search = input?.search || '';

    const currentUserInterests = await prisma.interest.findMany({
      select: {
        id: true,
      },
      where: {
        users: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    const currentUserInterestIds = currentUserInterests.map((interest) => interest.id);

    const filter: Prisma.StringFilter = {
      contains: search,
      mode: 'insensitive',
    };

    const users = await prisma.user.findMany({
      cursor: input?.cursor
        ? {
            id: input.cursor,
          }
        : undefined,
      take: ITEMS_PER_REQUEST + 1,
      select: {
        fullName: true,
        bio: true,
        city: true,
        country: true,
        dob: true,
        gender: true,
        id: true,
        profession: true,
        profilePicture: true,
        profilePictureMime: true,
        username: true,
      },
      where: {
        id: {
          not: session.user.id,
        },
        profilePicture: {
          not: null,
        },
        profilePictureMime: {
          not: null,
        },
        OR: [{ fullName: filter }, { city: filter }, { country: filter }, { profession: filter }, { username: filter }],
        interests: {
          some: {
            interestId: {
              in: currentUserInterestIds,
            },
          },
        },
      },
      orderBy: [
        {
          id: 'desc',
        },
        {
          interests: {
            _count: 'desc',
          },
        },
      ],
    });

    let nextCursor: string | undefined = undefined;
    if (users.length > ITEMS_PER_REQUEST) {
      nextCursor = users.pop()?.id;
    }

    return {
      items: users.map((user) => {
        return {
          ...user,
          id: Math.random().toString(),
          address: user.country && user.city && `${user.city}, ${user.country}`,
          profilePicture: resolveBase64ImageUrl(user.profilePictureMime, user.profilePicture) as string,
        };
      }),
      nextCursor,
    };
  },
});
