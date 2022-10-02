import { Chats } from '@prisma/client';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { enableChatScroll } from '../store/chatUIStore';
import type { ApprovedFriendWithFirstChat, FriendRequest } from '../types/friend';
import { pusher } from '../util/pusher';
import { trpc } from '../util/trpc';

interface UseFriendsListReturns {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  friends?: ApprovedFriendWithFirstChat[];
  receivedFriendRequests?: FriendRequest[];
  sentFriendRequests?: FriendRequest[];
}

export const useFriendsList = (enabled: boolean = true, subscribeToPusher: boolean = false): UseFriendsListReturns => {
  const { data: _sessionData } = useSession();
  const utils = trpc.useContext();
  const sessionData = _sessionData as Session;
  const { data, isLoading, isError, error } = trpc.useQuery(['friends.list'], {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      if (subscribeToPusher) {
        const friends = data.filter((friend) => Boolean(friend.approvedAt));
        friends.forEach((friend) => {
          const friendChannel = pusher.subscribe(`private-${friend.id}`);
          friendChannel.bind('message', (chat: Chats) => {
            enableChatScroll();
            utils.invalidateQueries([
              'chats.messagesByFriendId',
              {
                friendId: chat.friendsId,
              },
            ]);
            utils.invalidateQueries(['friends.list']);
          });
        });
      }
    },
  });

  const friends = data?.filter((friend) => Boolean(friend.approvedAt)) as ApprovedFriendWithFirstChat[] | undefined;

  friends?.sort((friend1, friend2) => {
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

  const receivedFriendRequests = data?.filter(
    (friend) => !friend.approvedAt && friend.receiverUserId === sessionData.user.id
  );

  receivedFriendRequests?.sort((friend1, friend2) => {
    return friend2.requestedAt.getTime() - friend1.requestedAt.getTime();
  });

  const sentFriendRequests = data?.filter(
    (friend) => !friend.approvedAt && friend.requestedUserId === sessionData.user.id
  );
  sentFriendRequests?.sort((friend1, friend2) => {
    return friend2.requestedAt.getTime() - friend1.requestedAt.getTime();
  });

  return {
    isLoading,
    isError,
    errorMessage: error?.message,
    friends,
    receivedFriendRequests,
    sentFriendRequests,
  };
};
