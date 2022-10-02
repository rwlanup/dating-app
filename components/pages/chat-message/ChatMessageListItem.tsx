import { Box, BoxProps, Typography } from '@mui/material';
import { Chats } from '@prisma/client';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { getRelativeTime } from '../../../util/date';

interface ChatMessageListItemProps extends BoxProps {
  message: Chats;
}

export const ChatMessageListItem: FC<ChatMessageListItemProps> = ({ message, sx = {}, ...otherProps }) => {
  const session = useSession();
  const loggedInUserId = session.data?.user.id;

  const isSent = message.senderId === loggedInUserId;
  const bgcolor: string = isSent ? 'secondary.200' : 'secondary.main';
  const color: string = isSent ? 'secondary.900' : 'secondary.contrastText';
  const alignItems: string = isSent ? 'flex-end' : 'flex-start';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems,
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor,
          maxWidth: { xs: '90%', sm: '80%', xl: '75%' },
          borderTopLeftRadius: '36px',
          borderTopRightRadius: '36px',
          borderBottomRightRadius: isSent ? 0 : '36px',
          borderBottomLeftRadius: isSent ? '36px' : 0,
          ...sx,
        }}
        {...otherProps}
      >
        <Typography
          component="span"
          color={color}
        >
          {message.message}
        </Typography>
      </Box>
      <Typography
        component="span"
        fontWeight="Medium"
        sx={{ fontSize: '0.75rem', mt: 0.25 }}
        color="text.secondary"
      >
        {getRelativeTime(message.sentAt)}
      </Typography>
    </Box>
  );
};
