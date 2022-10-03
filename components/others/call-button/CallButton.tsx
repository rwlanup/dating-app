import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import type { FC } from 'react';
import { trpc } from '../../../util/trpc';

interface CallButtonProps {
  id: string;
}
export const CallButton: FC<CallButtonProps> = ({ id }) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutate, isLoading } = trpc.useMutation('chats.call', {
    onSuccess(chat) {
      router.push(`/profile/chats/${chat.id}`);
    },
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
  const clickHandler = () => {
    mutate(id);
  };

  return (
    <Tooltip title="Call now">
      <IconButton
        color="primary"
        size="large"
        disabled={isLoading}
        onClick={clickHandler}
      >
        <CircularProgress sx={{ position: 'absolute', opacity: isLoading ? 1 : 0 }} />
        <CallTwoToneIcon />
      </IconButton>
    </Tooltip>
  );
};
