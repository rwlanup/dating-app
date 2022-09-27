import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { Skeleton } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useMemo } from 'react';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { trpc } from '../../../util/trpc';

interface FriendRequestButtonProps extends LoadingButtonProps {
  friendId: string;
}

export const FriendRequestButton: FC<FriendRequestButtonProps> = ({ friendId, ...otherProps }) => {
  const { enqueueSnackbar } = useSnackbar();
  const utils = trpc.useContext();

  const { friends, sentFriendRequests, receivedFriendRequests } = useFriendsList(false);

  const { mutate: sendRequest, isLoading: sendingRequest } = trpc.useMutation('friends.request', {
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onSuccess(data) {
      enqueueSnackbar(data.message, { variant: 'success' });
      utils.invalidateQueries(['friends.list-sent-requests']);
    },
  });
  const { mutate: respondToRequest, isLoading: respondingToRequest } = trpc.useMutation('friends.respond-request', {
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onSuccess(data, { response }) {
      enqueueSnackbar(data.message, { variant: 'success' });
      utils.invalidateQueries(['friends.list-received-requests']);

      if (response === 'ACCEPT') {
        utils.invalidateQueries(['friends.list']);
      }
    },
  });
  const { mutate: removeFriend, isLoading: removingFriend } = trpc.useMutation('friends.remove-friend', {
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onSuccess(data) {
      enqueueSnackbar(data.message, { variant: 'success' });
      utils.invalidateQueries(['friends.list']);
    },
  });

  const isFriend = useMemo(() => {
    if (!friends) return false;
    return (
      friends.findIndex((friend) => friend.receiverUserId === friendId || friend.requestedUserId === friendId) !== -1
    );
  }, [friends, friendId]);

  const hasSentRequest = useMemo(() => {
    if (!sentFriendRequests) return false;
    return sentFriendRequests.findIndex((friend) => friend.receiverUserId === friendId) !== -1;
  }, [sentFriendRequests, friendId]);

  const hasReceivedRequest = useMemo(() => {
    if (!receivedFriendRequests) return false;
    return receivedFriendRequests.findIndex((friend) => friend.requestedUserId === friendId) !== -1;
  }, [receivedFriendRequests, friendId]);
  if (!friends || !sentFriendRequests || !receivedFriendRequests) {
    return (
      <Skeleton
        variant="pill"
        height={44}
        width={160}
      />
    );
  }

  const btnLabel = isFriend
    ? 'Unfriend'
    : hasSentRequest
    ? 'Unsend friend request'
    : hasReceivedRequest
    ? 'Accept friend request'
    : 'Send friend request';

  const handleClick = (): void => {
    if (isFriend) {
      removeFriend(friendId);
    } else if (hasSentRequest) {
      sendRequest(friendId);
    } else if (hasReceivedRequest) {
      const request = receivedFriendRequests.find((request) => request.requestedUserId === friendId);
      if (request)
        respondToRequest({
          id: request.id,
          response: 'ACCEPT',
        });
    } else {
      sendRequest(friendId);
    }
  };

  return (
    <LoadingButton
      fullWidth
      {...otherProps}
      loading={sendingRequest || respondingToRequest || removingFriend}
      onClick={handleClick}
    >
      {btnLabel}
    </LoadingButton>
  );
};
