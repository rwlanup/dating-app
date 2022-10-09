import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';
import { SnackbarKey, useSnackbar } from 'notistack';

interface CallActionsProps {
  callId: string;
  callerId: string;
  friendId: string;
  snackbarId: SnackbarKey;
}

export const CallActions: FC<CallActionsProps> = ({ callId, callerId, friendId, snackbarId }) => {
  const router = useRouter();
  const { closeSnackbar } = useSnackbar();
  const handleAcceptCall = (): void => {
    closeSnackbar(snackbarId);
    router.push({
      query: {
        friendId,
        callerId,
      },
      pathname: `/profile/chats/${callId}`,
    });
  };

  const handleRejectCall = (): void => {
    closeSnackbar(snackbarId);
    console.log('reject');
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
