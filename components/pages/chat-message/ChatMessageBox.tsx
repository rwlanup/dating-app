import { Box, CircularProgress, Grid, IconButton, TextField } from '@mui/material';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { trpc } from '../../../util/trpc';
import { useSnackbar } from 'notistack';

interface ChatMessageBoxProps {
  friendId: string;
  isPrivate?: boolean;
  onSend?: (message: string) => void;
}

export const ChatMessageBox: FC<ChatMessageBoxProps> = ({ friendId, isPrivate, onSend }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');
  const { mutate, isLoading } = trpc.useMutation('chats.sendMessage', {
    onSuccess: () => {
      setMessage('');
    },
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length !== 0) {
      if (!isPrivate) {
        mutate({
          friendId,
          message,
          type: 'MESSAGE',
        });
      } else {
        if (onSend) {
          onSend(message);
        }
        setMessage('');
      }
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 2, xl: 3 },
        py: 2,
        position: 'sticky',
        bottom: 0,
        left: 0,
        bgcolor: 'common.white',
        mt: 'auto',
      }}
    >
      <Grid
        container
        columnSpacing={1}
        component="form"
        alignItems="flex-end"
        flexWrap="nowrap"
        onSubmit={sendMessage}
      >
        <Grid
          item
          xs
        >
          <TextField
            InputProps={{ sx: { fontSize: '0.875rem' } }}
            placeholder="Your message..."
            multiline
            value={message}
            onChange={handleChange}
            maxRows={6}
          />
        </Grid>
        <Grid item>
          <IconButton
            type="submit"
            color="primary"
            size="large"
            disabled={isLoading}
            sx={{ position: 'relative' }}
          >
            {isLoading && (
              <CircularProgress
                sx={{ position: 'absolute' }}
                size="1rem"
                color="secondary"
              />
            )}
            <SendTwoToneIcon sx={{ opacity: isLoading ? 0 : 1 }} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};
