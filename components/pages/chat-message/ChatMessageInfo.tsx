import { Typography } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

export const ChatMessageInfo: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Typography
      variant="content"
      fontWeight="Medium"
      color="text.secondary"
      align="center"
      component="p"
      sx={{ py: 2 }}
    >
      {children}
    </Typography>
  );
};
