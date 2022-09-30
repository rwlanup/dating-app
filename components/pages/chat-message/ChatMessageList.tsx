import { Grid } from '@mui/material';
import type { Chats } from '@prisma/client';
import type { FC } from 'react';
import { ChatMessageInfo } from './ChatMessageInfo';
import { ChatMessageListItem } from './ChatMessageListItem';

interface ChatMessageListProps {
  chatMessages: Chats[];
  friendName: string;
}

export const ChatMessageList: FC<ChatMessageListProps> = ({ chatMessages, friendName }) => {
  return (
    <Grid
      container
      direction="column"
      spacing={0.5}
      flexWrap="nowrap"
    >
      {chatMessages.map((message) => (
        <Grid
          key={message.id}
          item
          xs
        >
          {message.type === 'MESSAGE' && <ChatMessageListItem message={message} />}
          {message.type === 'CALL' && <ChatMessageInfo>You were in call with {friendName}</ChatMessageInfo>}
        </Grid>
      ))}
    </Grid>
  );
};
