import { Box, BoxProps, Typography } from '@mui/material';
import type { FC } from 'react';

interface ChatMessageListItemProps extends BoxProps {
  variant: 'SENT' | 'RECEIVED';
}

export const ChatMessageListItem: FC<ChatMessageListItemProps> = ({ variant, sx = {}, ...otherProps }) => {
  const isSent = variant === 'SENT';
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
          Can you say I love you to me?
        </Typography>
      </Box>
      <Typography
        component="span"
        fontWeight="Medium"
        sx={{ fontSize: '0.75rem', mt: 0.25 }}
        color="text.secondary"
      >
        08:31 PM
      </Typography>
    </Box>
  );
};
