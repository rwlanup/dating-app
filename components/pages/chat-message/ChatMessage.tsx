import { Box } from '@mui/material';
import type { FC } from 'react';
import { ChatMessageBox } from './ChatMessageBox';
import { ChatMessageHeader } from './ChatMessageHeader';
import { ChatMessageList } from './ChatMessageList';

export const ChatMessage: FC = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        height: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ChatMessageHeader />
      <Box sx={{ px: { xs: 2, xl: 3 } }}>
        <ChatMessageList />
      </Box>

      <ChatMessageBox />
    </Box>
  );
};
