import type { Prisma, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { Session } from 'next-auth';
import { ITEMS_PER_REQUEST } from '../../common/config/support';
import { friendRequestSchema } from '../../common/validation/friends/request';
import { respondFriendSchema } from '../../common/validation/friends/respond';
import { paginationSchema } from '../../common/validation/pagination/pagination';
import { authMiddleware } from '../../middleware/auth';
import { FriendWithProfile, RawFriendWithProfile } from '../../types/friend';
import { PaginatedProfile } from '../../types/profile';
import { DataWithSuccessMessage } from '../../types/server';
import { resolveBase64ImageUrl } from '../../util/string';
import { createRouter } from '../createRouter';

export const friendsRouter = createRouter()
  .middleware(authMiddleware)
  .query('discover', {
    input: paginationSchema,
    resolve: async ({ input, ctx: { prisma, session } }): Promise<PaginatedProfile> => {
      const search = input?.search || '';
      const _session = session as Session;

      const currentUserInterests = await prisma.interest.findMany({
        select: {
          id: true,
        },
        where: {
          users: {
            some: {
              userId: _session.user.id,
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
            not: _session.user.id,
          },
          profilePicture: {
            not: null,
          },
          profilePictureMime: {
            not: null,
          },
          OR: [
            { fullName: filter },
            { city: filter },
            { country: filter },
            { profession: filter },
            { username: filter },
          ],
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
            address: user.country && user.city && `${user.city}, ${user.country}`,
            profilePicture: resolveBase64ImageUrl(user.profilePictureMime, user.profilePicture) as string,
          };
        }),
        nextCursor,
      };
    },
  })

  .query('list', {
    resolve: async ({ ctx: { prisma, session } }): Promise<FriendWithProfile[]> => {
      const _session = session as Session;
      const user = await prisma.user.findUnique({
        where: {
          id: _session.user.id,
        },
        select: {
          RequestedFriends: {
            where: {
              approvedAt: {
                not: null,
              },
            },
            include: {
              receiverUser: true,
            },
          },
          ReceivedFriends: {
            where: {
              approvedAt: {
                not: null,
              },
            },
            include: {
              requestedUser: true,
            },
          },
        },
      });

      const friends: FriendWithProfile[] = [];
      if (user) {
        [...(user.ReceivedFriends || []), ...(user.RequestedFriends || [])].map((friend) => {
          const user = 'requestedUser' in friend ? friend.requestedUser : friend.receiverUser;
          delete (user as Partial<User>).password;

          const newFriend: RawFriendWithProfile = {
            ...friend,
            profile: {
              ...user,
              profilePicture: resolveBase64ImageUrl(user.profilePictureMime, user.profilePicture),
              address: user.country && user.city && `${user.city}, ${user.country}`,
            },
          };
          if (newFriend.requestedUser) {
            delete newFriend.requestedUser;
          }
          if (newFriend.receiverUser) {
            delete newFriend.receiverUser;
          }
          friends.push(newFriend);
        });
      }
      return friends;
    },
  })

  .query('list-received-requests', {
    resolve: async ({ ctx: { prisma, session } }): Promise<FriendWithProfile[]> => {
      const _session = session as Session;
      const user = await prisma.user.findUnique({
        where: {
          id: _session.user.id,
        },
        select: {
          ReceivedFriends: {
            where: {
              approvedAt: null,
            },
            include: {
              requestedUser: true,
            },
          },
        },
      });

      const friends: FriendWithProfile[] = [];
      if (user) {
        user.ReceivedFriends.map((friend) => {
          const user = friend.requestedUser;
          delete (user as Partial<User>).password;

          const newFriend: RawFriendWithProfile = {
            ...friend,
            profile: {
              ...user,
              profilePicture: resolveBase64ImageUrl(user.profilePictureMime, user.profilePicture),
              address: user.country && user.city && `${user.city}, ${user.country}`,
            },
          };
          if (newFriend.requestedUser) {
            delete newFriend.requestedUser;
          }
          friends.push(newFriend);
        });
      }
      return friends;
    },
  })

  .query('list-sent-requests', {
    resolve: async ({ ctx: { prisma, session } }): Promise<FriendWithProfile[]> => {
      const _session = session as Session;
      const user = await prisma.user.findUnique({
        where: {
          id: _session.user.id,
        },
        select: {
          RequestedFriends: {
            where: {
              approvedAt: null,
            },
            include: {
              receiverUser: true,
            },
          },
        },
      });

      const friends: FriendWithProfile[] = [];
      if (user) {
        user.RequestedFriends.map((friend) => {
          const user = friend.receiverUser;
          delete (user as Partial<User>).password;

          const newFriend: RawFriendWithProfile = {
            ...friend,
            profile: {
              ...user,
              profilePicture: resolveBase64ImageUrl(user.profilePictureMime, user.profilePicture),
              address: user.country && user.city && `${user.city}, ${user.country}`,
            },
          };
          if (newFriend.receiverUser) {
            delete newFriend.receiverUser;
          }
          friends.push(newFriend);
        });
      }
      return friends;
    },
  })

  .mutation('request', {
    input: friendRequestSchema,
    resolve: async ({ ctx: { prisma, session }, input }): Promise<DataWithSuccessMessage> => {
      const _session = session as Session;

      const sentRequest = await prisma.friends.findFirst({
        where: {
          receiverUserId: {
            in: [_session.user.id, input],
          },
          requestedUserId: {
            in: [_session.user.id, input],
          },
        },
      });

      if (sentRequest) {
        if (!sentRequest.approvedAt) {
          await prisma.friends.delete({
            where: {
              id: sentRequest.id,
            },
          });

          return {
            message: 'Friend request has been removed successfully',
            status: 200,
          };
        } else {
          return {
            message: 'You are already friends with the user',
            status: 200,
          };
        }
      } else {
        const currentUserFriendsCount = await prisma.friends.count({
          where: {
            OR: [
              {
                receiverUserId: _session.user.id,
              },
              {
                requestedUserId: _session.user.id,
              },
            ],
            approvedAt: {
              not: null,
            },
          },
        });

        if (currentUserFriendsCount >= 20) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Your friends limit has been reached. You cannot have more than 20 friends at a same time',
          });
        }

        const sentUserFriendsCount = await prisma.friends.count({
          where: {
            OR: [
              {
                receiverUserId: input,
              },
              {
                requestedUserId: input,
              },
            ],
            approvedAt: {
              not: null,
            },
          },
        });

        if (sentUserFriendsCount >= 20) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'The user you are trying to send a request already has 20 friends. Please try again later',
          });
        }
        await prisma.friends.create({
          data: {
            requestedUserId: _session.user.id,
            receiverUserId: input,
          },
        });

        return {
          message: 'Friend request has been sent successfully',
          status: 201,
        };
      }
    },
  })

  .mutation('respond-request', {
    input: respondFriendSchema,
    resolve: async ({ ctx: { prisma, session }, input }): Promise<DataWithSuccessMessage> => {
      const _session = session as Session;
      const { id, response } = input;

      const sentRequest = await prisma.friends.findFirst({
        where: {
          id,
          receiverUserId: _session.user.id,
          approvedAt: null,
        },
      });

      if (!sentRequest) {
        throw new TRPCError({
          message: 'Oops, your friend request is invalid',
          code: 'BAD_REQUEST',
        });
      }

      if (response === 'ACCEPT') {
        const currentUserFriendsCount = await prisma.friends.count({
          where: {
            OR: [
              {
                receiverUserId: _session.user.id,
              },
              {
                requestedUserId: _session.user.id,
              },
            ],
            approvedAt: {
              not: null,
            },
          },
        });

        if (currentUserFriendsCount >= 20) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Your friends limit has been reached. You cannot have more than 20 friends at a same time',
          });
        }

        const sentUserFriendsCount = await prisma.friends.count({
          where: {
            OR: [
              {
                receiverUserId: sentRequest.requestedUserId,
              },
              {
                requestedUserId: sentRequest.requestedUserId,
              },
            ],
            approvedAt: {
              not: null,
            },
          },
        });

        if (sentUserFriendsCount >= 20) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'The user you are trying to accept a request from already has 20 friends. Please try again later',
          });
        }

        await prisma.friends.update({
          data: {
            approvedAt: new Date(),
          },
          where: {
            id: sentRequest.id,
          },
        });
      } else {
        await prisma.friends.delete({
          where: {
            id: sentRequest.id,
          },
        });
      }

      return {
        message:
          response === 'ACCEPT' ? 'Your friends list has been updated' : 'Your friend request list has been updated',
        status: 200,
      };
    },
  })

  .mutation('remove-friend', {
    input: friendRequestSchema,
    resolve: async ({ ctx: { prisma, session }, input }): Promise<DataWithSuccessMessage> => {
      const _session = session as Session;

      const friend = await prisma.friends.findFirst({
        where: {
          receiverUserId: {
            in: [input, _session.user.id],
          },
          requestedUserId: {
            in: [input, _session.user.id],
          },
          approvedAt: {
            not: null,
          },
        },
      });

      if (friend) {
        await prisma.friends.delete({
          where: {
            id: friend.id,
          },
        });
      }
      return {
        message: 'You are unfriended successfully',
        status: 200,
      };
    },
  });
