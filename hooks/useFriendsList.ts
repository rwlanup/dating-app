import { FriendWithProfile } from '../types/friend';
import { trpc } from '../util/trpc';

interface UseFriendsListReturns {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  friends?: FriendWithProfile[];
  receivedFriendRequests?: FriendWithProfile[];
  sentFriendRequests?: FriendWithProfile[];
}

export const useFriendsList = (enabled: boolean = true): UseFriendsListReturns => {
  const {
    data: friends,
    isLoading: isFriendsLoading,
    isError: isFriendsError,
    error: friendsError,
  } = trpc.useQuery(['friends.list'], {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const {
    data: receivedFriendRequests,
    isLoading: isReceivedFriendRequestsLoading,
    isError: isReceivedFriendRequestsError,
    error: receivedFriendRequestsError,
  } = trpc.useQuery(['friends.list-received-requests'], {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const {
    data: sentFriendRequests,
    isLoading: isSentFriendRequestsLoading,
    isError: isSentFriendRequestsError,
    error: sentFriendRequestsError,
  } = trpc.useQuery(['friends.list-sent-requests'], {
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading: isFriendsLoading || isReceivedFriendRequestsLoading || isSentFriendRequestsLoading,
    isError: isFriendsError || isReceivedFriendRequestsError || isSentFriendRequestsError,
    errorMessage: friendsError?.message || receivedFriendRequestsError?.message || sentFriendRequestsError?.message,
    friends,
    receivedFriendRequests,
    sentFriendRequests,
  };
};
