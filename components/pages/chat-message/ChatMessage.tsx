import { Box } from '@mui/material';
import { Chats } from '@prisma/client';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { trpc } from '../../../util/trpc';
import { ChatMessageBox } from './ChatMessageBox';
import { ChatMessageHeader } from './ChatMessageHeader';
import { ChatMessageList } from './ChatMessageList';

export const ChatMessage: FC = () => {
  const { query } = useRouter();
  const hasFriendId = typeof query.id === 'string';
  const { data: friends } = trpc.useQuery(['chats.friends'], {
    enabled: false,
  });

  const friendInfo = friends?.find((friend) => friend.friendId === (query.id as string));

  const { isLoading, data, isFetchingNextPage, hasNextPage, isError, error, fetchNextPage } = trpc.useInfiniteQuery(
    ['chats.messagesByFriendId', { friendId: query.id as string }],
    {
      enabled: Boolean(hasFriendId && friendInfo),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!hasFriendId || !friendInfo) return null;

  if (!data) return <div>No data</div>;
  const chatMessages = data.pages.reduce<Chats[]>((prevChats, page) => {
    return [...page.items, ...prevChats];
  }, []);

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
      <ChatMessageHeader friendInfo={friendInfo} />
      <Box sx={{ px: { xs: 2, xl: 3 } }}>
        <ChatMessageList
          friendName={friendInfo.fullName}
          chatMessages={chatMessages}
        />
      </Box>

      <ChatMessageBox />
    </Box>
  );
};
