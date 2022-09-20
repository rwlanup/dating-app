import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { paginationSchema } from '../../common/validation/pagination/pagination';
import { ProfileListItem } from '../../types/profile';
import { resolveBase64ImageUrl } from '../../util/string';
import { createRouter } from '../createRouter';

export const friendsRouter = createRouter().query('discover', {
  input: paginationSchema,
  resolve: async ({ input, ctx: { prisma, session } }): Promise<ProfileListItem[]> => {
    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in, please log in to update your profile.',
      });
    }

    const page = input?.page || 1;
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
      skip: (page - 1) * 10,
      take: 10,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => {
      return {
        ...user,
        address: user.country && user.city && `${user.city}, ${user.country}`,
        profilePicture: resolveBase64ImageUrl(user.profilePictureMime, user.profilePicture) as string,
      };
    });
  },
});
