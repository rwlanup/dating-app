import { Chats } from '@prisma/client';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { PusherContext } from '../context/pusher';
import { SignalData } from '../pages/profile/chats/[callId]';
import { enableChatScroll } from '../store/chatUIStore';
import type { ApprovedFriendWithFirstChat, FriendRequest } from '../types/friend';
import { trpc } from '../util/trpc';
import { CallActions } from '../components/others/call-actions/CallActions';

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

  const { pathname } = useRouter();
  const { data: _sessionData } = useSession();
  const utils = trpc.useContext();
  const sessionData = _sessionData as Session;
  const { mutate: updateLastChatRead } = trpc.useMutation('profile.updateLastChatRead');
  const { data, isLoading, isError, error, isSuccess } = trpc.useQuery(['friends.list'], {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      const friends = data.filter((friend) => Boolean(friend.approvedAt));
      friends.forEach((friend) => {
        if (pusher) {
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

              // Update last chat page visits
              if (pathname === '/profile/chats') {
                updateLastChatRead();
              }
            });
          }

          if (!friendChannel.callbacks.get(`client-call-${friend.id}`)) {
            friendChannel.bind(`client-call-${friend.id}`, (signal: SignalData) => {
              switch (signal.type) {
                case 'callOffer':
                  enqueueSnackbar(`You have a call from ${friend.profile.fullName}`, {
                    action: (key) => (
                      <CallActions
                        callId={signal.callId}
                        callerId={signal.callerId}
                        friendId={friend.id}
                        snackbarId={key}
                      />
                    ),
                    persist: true,
                    anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
                    key: signal.callId,
                  });
                  break;
                case 'callEnd':
                  closeSnackbar(signal.callId);
                  break;
                default:
                  break;
              }
            });
          }
        }
      });
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
    isSuccess,
  };
};
