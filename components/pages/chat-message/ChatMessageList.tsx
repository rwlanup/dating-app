import { Grid } from '@mui/material';
import type { Chats } from '@prisma/client';
import { FC, useEffect } from 'react';
import { trpc } from '../../../util/trpc';
import { ChatMessageInfo } from './ChatMessageInfo';
import { ChatMessageListItem } from './ChatMessageListItem';

interface ChatMessageListProps {
  chatMessages: Chats[];
  friendName: string;
  friendId: string;
}

export const ChatMessageList: FC<ChatMessageListProps> = ({ chatMessages, friendName, friendId }) => {
  const isLastChatRead = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].isRead : true;
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('chats.updateChatRead', {
    onSuccess() {
      utils.invalidateQueries(['friends.list']);
    },
  });

  useEffect(() => {
    if (!isLastChatRead) {
      mutate(friendId);
    }
  }, [isLastChatRead, friendId, mutate]);

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
