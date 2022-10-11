import { Chats } from '@prisma/client';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useMemo } from 'react';
import { PusherContext } from '../context/pusher';
import { enableChatScroll } from '../store/chatUIStore';
import type { ApprovedFriendWithFirstChat, FriendRequest } from '../types/friend';
import { trpc } from '../util/trpc';
import { CallActions } from '../components/others/call-actions/CallActions';
import { SignalData } from './useRTCWithPusher';

interface UseFriendsListReturns {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage?: string;
  friends?: ApprovedFriendWithFirstChat[];
  receivedFriendRequests?: FriendRequest[];
  sentFriendRequests?: FriendRequest[];
}

export const useFriendsList = (enabled: boolean = true): UseFriendsListReturns => {
  const pusher = useContext(PusherContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { data: _sessionData } = useSession();
  const utils = trpc.useContext();
  const sessionData = _sessionData as Session;
  const { data, isLoading, isError, error, isSuccess } = trpc.useQuery(['friends.list'], {
    enabled,
    cacheTime: !enabled ? 0 : undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const friends = useMemo(
    () => data?.filter((friend) => Boolean(friend.approvedAt)) as ApprovedFriendWithFirstChat[] | undefined,
    [data]
  );

  useEffect(() => {
    if (friends && pusher) {
      friends.forEach((friend) => {
        const friendChannel = pusher.channel(`private-${friend.id}`) || pusher.subscribe(`private-${friend.id}`);
        if (!friendChannel.callbacks.get('message')) {
          friendChannel.bind('message', async (chat: Chats) => {
            utils.invalidateQueries([
              'chats.messagesByFriendId',
              {
                friendId: chat.friendsId,
              },
            ]);
            await utils.invalidateQueries(['friends.list']);
            enableChatScroll();
          });
        }
        if (!friendChannel.callbacks.get(`client-call-${friend.id}`)) {
          friendChannel.bind(`client-call-${friend.id}`, (signal: SignalData) => {
            switch (signal.type) {
              case 'callOffer':
                enqueueSnackbar(
                  signal.mode === 'text'
                    ? `${friend.profile.fullName} wants to chat in private`
                    : `You have a call from ${friend.profile.fullName}`,
                  {
                    action: (key) => (
                      <CallActions
                        mode={signal.mode}
                        callId={signal.callId}
                        callerId={signal.callerId}
                        friendId={friend.id}
                        snackbarId={key}
                      />
                    ),
                    persist: true,
                    anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
                    key: signal.callId,
                  }
                );
                break;
              case 'callEnd':
                closeSnackbar(signal.callId);
                break;
              default:
                break;
            }
          });
        }
      });
    }
  }, [friends, pusher, closeSnackbar, enqueueSnackbar, utils]);

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
    isSuccess,
  };
};
