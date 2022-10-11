import { Grid } from '@mui/material';
import type { Chats } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useMemo } from 'react';
import { RTCMessage } from '../../../hooks/useRTCWithPusher';
import { trpc } from '../../../util/trpc';
import { ChatMessageInfo } from './ChatMessageInfo';
import { ChatMessageListItem } from './ChatMessageListItem';

interface ChatMessageListProps {
  chatMessages: Chats[] | RTCMessage[];
  friendName: string;
  friendId: string;
}

export const ChatMessageList: FC<ChatMessageListProps> = ({ chatMessages, friendName, friendId }) => {
  const { data } = useSession();
  const isLastChatRead = useMemo(() => {
    const length = chatMessages.length;
    if (length > 0 && data) {
      const lastChat = chatMessages[length - 1];
      if ('content' in lastChat) {
        return true;
      } else {
        return lastChat.isRead || data.user.id === lastChat.senderId;
      }
    }
    return true;
  }, [chatMessages, data]);
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
      {chatMessages.map((message, index) => (
        <Grid
          key={'content' in message ? `${message.content}-${index}` : message.id}
          item
          xs
        >
          {'content' in message ? (
            <ChatMessageListItem message={message} />
          ) : (
            <>
              {message.type === 'MESSAGE' && <ChatMessageListItem message={message} />}
              {message.type === 'CALL' && <ChatMessageInfo>You were in call with {friendName}</ChatMessageInfo>}
            </>
          )}
        </Grid>
      ))}
    </Grid>
  );
};
