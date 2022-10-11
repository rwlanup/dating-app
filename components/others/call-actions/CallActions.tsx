import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';
import { SnackbarKey, useSnackbar } from 'notistack';
import { PusherContext } from '../../../context/pusher';
import { trpc } from '../../../util/trpc';
import { CallMode, SignalData } from '../../../hooks/useRTCWithPusher';

interface CallActionsProps {
  callId: string;
  callerId: string;
  friendId: string;
  snackbarId: SnackbarKey;
  mode: CallMode;
}

export const CallActions: FC<CallActionsProps> = ({ callId, callerId, friendId, snackbarId, mode }) => {
  const router = useRouter();
  const pusher = useContext(PusherContext);
  const { closeSnackbar } = useSnackbar();
  const { mutate: updateChatRead } = trpc.useMutation('chats.updateChatRead');
  const handleAcceptCall = (): void => {
    closeSnackbar(snackbarId);
    if (mode === 'text') {
      if (router.pathname === '/profile/private/[friendId]') {
        window.open(`/profile/private/${friendId}?senderId=${callerId}`, '_blank');
      } else {
        router.push({
          query: {
            senderId: callerId,
          },
          pathname: `/profile/private/${friendId}`,
        });
      }
    } else {
      updateChatRead(friendId);
      if (router.pathname === '/profile/chats/[callId]') {
        window.open(`/profile/chats/${callId}?friendId=${friendId}&callerId=${callerId}`, '_blank');
      } else {
        router.push({
          query: {
            friendId,
            callerId,
          },
          pathname: `/profile/chats/${callId}`,
        });
      }
    }
  };

  const handleRejectCall = (): void => {
    if (mode === 'video') {
      updateChatRead(friendId);
    }
    if (pusher && pusher.channel(`private-${friendId}`)) {
      pusher.channel(`private-${friendId}`).trigger(`client-call-${friendId}`, {
        type: 'callReject',
        callId,
      } as SignalData);
    }
    closeSnackbar(snackbarId);
  };

  return (
    <>
      <IconButton
        color="error"
        onClick={handleRejectCall}
        sx={{
          bgcolor: 'error.contrastText',
          mr: 1,
          '&:hover, &:focus': {
            bgcolor: 'error.100',
          },
        }}
      >
        <CallEndTwoToneIcon />
      </IconButton>
      <IconButton
        color="success"
        sx={{
          bgcolor: 'success.contrastText',
          '&:hover, &:focus': {
            bgcolor: 'success.100',
          },
        }}
        onClick={handleAcceptCall}
      >
        <CallTwoToneIcon />
      </IconButton>
    </>
  );
};
