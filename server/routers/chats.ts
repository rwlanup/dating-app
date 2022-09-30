import { TRPCError } from '@trpc/server';
import type { Session } from 'next-auth';
import { ITEMS_PER_REQUEST } from '../../common/config/support';
import { chatSchema } from '../../common/validation/chats/chat';
import { messageByFriendIdSchema } from '../../common/validation/chats/messageByFriendId';
import { authMiddleware } from '../../middleware/auth';
import { FriendWithFirstChat, PaginatedChat } from '../../types/chat';
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
  })

  .query('messagesByFriendId', {
    input: messageByFriendIdSchema,
    resolve: async ({ input, ctx: { prisma, session } }): Promise<PaginatedChat> => {
      const _session = session as Session;

      const friend = await prisma.friends.findUnique({
        where: {
          id: input.friendId,
        },
        select: {
          receiverUserId: true,
          requestedUserId: true,
          approvedAt: true,
        },
      });

      if (
        !friend ||
        !friend.approvedAt ||
        !(friend.receiverUserId === _session.user.id || friend.requestedUserId === _session.user.id)
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to access this chat messages',
        });
      }

      const chats = await prisma.chats.findMany({
        where: {
          friendsId: input.friendId,
        },
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
        take: ITEMS_PER_REQUEST + 1,
        orderBy: {
          sentAt: 'desc',
        },
      });

      let nextCursor: string | undefined = undefined;
      if (chats.length > ITEMS_PER_REQUEST) {
        nextCursor = chats.pop()?.id;
      }

      return {
        items: chats.reverse(),
        nextCursor,
      };
    },
  })

  .mutation('sendMessage', {
    input: chatSchema,
    resolve: async ({ ctx: { prisma, session, pusher }, input: { friendId, type, message } }): Promise<void> => {
      const _session = session as Session;
      const friend = await prisma.friends.findUnique({
        where: { id: friendId },
        select: {
          id: true,
          receiverUserId: true,
          requestedUserId: true,
          approvedAt: true,
        },
      });

      if (
        !friend ||
        !friend.approvedAt ||
        !(friend.receiverUserId === _session.user.id || friend.requestedUserId === _session.user.id)
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to access this chat messages',
        });
      }

      const receiverId = _session.user.id === friend.receiverUserId ? friend.requestedUserId : friend.receiverUserId;

      const chat = await prisma.chats.create({
        data: {
          message,
          type,
          senderId: _session.user.id,
          receiverId,
          friendsId: friend.id,
        },
      });

      pusher.trigger(`private-${friend.id}`, 'message', chat);
    },
  });
