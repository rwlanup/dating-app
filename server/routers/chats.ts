import { TRPCError } from '@trpc/server';
import type { Session } from 'next-auth';
import { authMiddleware } from '../../middleware/auth';
import { FriendWithFirstChat } from '../../types/chat';
import { resolveBase64ImageUrl } from '../../util/string';
import { createRouter } from '../createRouter';

export const chatsRouter = createRouter()
  .middleware(authMiddleware)
  .query('friends', {
    resolve: async ({ ctx: { prisma, session } }): Promise<FriendWithFirstChat[]> => {
      const _session = session as Session;
      const friendsFromReceivedRequest = await prisma.friends.findMany({
        where: {
          approvedAt: {
            not: null,
          },
          receiverUserId: _session.user.id,
        },
        select: {
          id: true,
          approvedAt: true,
          requestedUser: {
            select: {
              id: true,
              fullName: true,
              profession: true,
              profilePicture: true,
              profilePictureMime: true,
              username: true,
            },
          },
          Chats: {
            take: 1,
            orderBy: {
              sentAt: 'desc',
            },
          },
        },
      });

      const friendsFromSentRequest = await prisma.friends.findMany({
        where: {
          approvedAt: {
            not: null,
          },
          requestedUserId: _session.user.id,
        },
        select: {
          id: true,
          approvedAt: true,
          receiverUser: {
            select: {
              id: true,
              fullName: true,
              profession: true,
              profilePicture: true,
              profilePictureMime: true,
              username: true,
            },
          },
          Chats: {
            take: 1,
            orderBy: {
              sentAt: 'desc',
            },
          },
        },
      });

      const friendsWithFirstChat: FriendWithFirstChat[] = [];
      friendsFromReceivedRequest.forEach(({ Chats, requestedUser, approvedAt, id }) => {
        friendsWithFirstChat.push({
          ...requestedUser,
          friendId: id,
          approvedAt: approvedAt as Date,
          profilePicture: resolveBase64ImageUrl(requestedUser.profilePictureMime, requestedUser.profilePicture),
          chat: Chats.length > 0 ? Chats[0] : undefined,
        });
      });
      friendsFromSentRequest.forEach(({ Chats, receiverUser, approvedAt, id }) => {
        friendsWithFirstChat.push({
          ...receiverUser,
          friendId: id,
          approvedAt: approvedAt as Date,
          profilePicture: resolveBase64ImageUrl(receiverUser.profilePictureMime, receiverUser.profilePicture),
          chat: Chats.length > 0 ? Chats[0] : undefined,
        });
      });

      friendsWithFirstChat.sort((friend1, friend2) => {
        if (friend1.chat && friend2.chat) {
          return friend2.chat.sentAt.getTime() - friend1.chat.sentAt.getTime();
        }

        if (friend1.chat && !friend2.chat) {
          return friend2.approvedAt.getTime() - friend1.chat.sentAt.getTime();
        }

        if (friend2.chat && !friend1.chat) {
          return friend2.chat.sentAt.getTime() - friend1.approvedAt.getTime();
        }

        return friend2.approvedAt.getTime() - friend1.approvedAt.getTime();
      });

      return friendsWithFirstChat;
    },
  });
