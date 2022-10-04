import { Chats } from '@prisma/client';
import type { Session } from 'next-auth';
import { ITEMS_PER_REQUEST } from '../../common/config/support';
import { chatSchema } from '../../common/validation/chats/chat';
import { callRespondSchema } from '../../common/validation/chats/callRespond';
import { messageByFriendIdSchema } from '../../common/validation/chats/messageByFriendId';
import { friendIdSchema } from '../../common/validation/friends/request';
import { authMiddleware } from '../../middleware/auth';
import { checkIfAuthorizedFriendId } from '../../middleware/authFriendId';
import { PaginatedChat } from '../../types/chat';
import { DataWithSuccessMessage } from '../../types/server';
import { createRouter } from '../createRouter';

export const chatsRouter = createRouter()
  .middleware(authMiddleware)

  .query('messagesByFriendId', {
    input: messageByFriendIdSchema,
    resolve: async ({ input, ctx: { prisma, session } }): Promise<PaginatedChat> => {
      const _session = session as Session;

      await checkIfAuthorizedFriendId(_session, input.friendId);

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
    resolve: async ({
      ctx: { prisma, session, pusher },
      input: { friendId, type, message },
    }): Promise<DataWithSuccessMessage> => {
      const _session = session as Session;
      const friend = await checkIfAuthorizedFriendId(_session, friendId);

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

      await pusher.trigger(`private-${friend.id}`, 'message', chat);
      return {
        message: 'Your message has been sent successfully',
        status: 201,
      };
    },
  })

  .mutation('updateChatRead', {
    input: friendIdSchema,
    resolve: async ({ ctx: { prisma, session }, input }): Promise<DataWithSuccessMessage> => {
      const _session = session as Session;
      await checkIfAuthorizedFriendId(_session, input);

      await prisma.chats.updateMany({
        where: {
          friendsId: input,
        },
        data: {
          isRead: true,
        },
      });
      return {
        message: 'Your chat status has been updated successfully',
        status: 200,
      };
    },
  })

  .mutation('call', {
    input: friendIdSchema,
    resolve: async ({ ctx: { prisma, session, pusher }, input }): Promise<Chats> => {
      const _session = session as Session;
      const friend = await checkIfAuthorizedFriendId(_session, input);
      const receiverUserId =
        _session.user.id === friend.receiverUserId ? friend.requestedUserId : friend.receiverUserId;

      // const chat = await prisma.chats.create({
      //   data: {
      //     type: 'CALL',
      //     isRead: false,
      //     friendsId: friend.id,
      //     senderId: _session.user.id,
      //     receiverId: receiverUserId,
      //   },
      // });
      const chat = await prisma.chats.findFirst({
        where: {
          friendsId: input,
          type: 'CALL',
        },
      });

      // await pusher.sendToUser(receiverUserId, 'call', chat);
      // await pusher.sendToUser(_session.user.id, 'call', chat);

      return chat as Chats;
    },
  })

  .mutation('respondCall', {
    input: callRespondSchema,
    resolve: async ({ ctx: { prisma, pusher }, input }) => {
      const chat = await prisma.chats.update({
        where: {
          id: input.id,
        },
        data: {
          isRead: true,
        },
      });
      await pusher.sendToUser(chat.receiverId, 'callRespond', chat);
      await pusher.sendToUser(chat.senderId, 'callRespond', chat);
      return chat;
    },
  });
