import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import { prisma } from '../server/prisma';
import type { Friends } from '@prisma/client';

export const checkIfAuthorizedFriendId = async (session: Session, friendId: string): Promise<Friends> => {
  const friend = await prisma.friends.findUnique({
    where: {
      id: friendId,
    },
  });

  if (
    !friend ||
    !friend.approvedAt ||
    !(friend.receiverUserId === session.user.id || friend.requestedUserId === session.user.id)
  ) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to access this chat messages',
    });
  }
  return friend;
};
