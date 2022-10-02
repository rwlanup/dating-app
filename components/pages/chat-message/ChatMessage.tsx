import { Box, Typography } from '@mui/material';
import { Chats } from '@prisma/client';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef } from 'react';
import { useStore } from '../../../hooks/useStore';
import { chatUIStore, disableChatScroll, enableChatScroll } from '../../../store/chatUIStore';
import { throttle } from '../../../util/callback';
import { trpc } from '../../../util/trpc';
import { ChatMessageBox } from './ChatMessageBox';
import { ChatMessageHeader } from './ChatMessageHeader';
import { ChatMessageList } from './ChatMessageList';

export const ChatMessage: FC = () => {
  const { query } = useRouter();
  const shouldScroll = useStore(
    chatUIStore,
    (state) => state.shouldScroll,
    () => true
  );
  const containerRef = useRef<HTMLDivElement>();
  const hasFriendId = typeof query.id === 'string';
  const { data: friends } = trpc.useQuery(['chats.friends'], {
    enabled: false,
  });

  const friendInfo = friends?.find((friend) => friend.friendId === (query.id as string));

  const { isLoading, data, hasNextPage, isError, error, fetchNextPage, isSuccess, isFetchingNextPage } =
    trpc.useInfiniteQuery(['chats.messagesByFriendId', { friendId: query.id as string }], {
      enabled: Boolean(hasFriendId && friendInfo),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  // Handling scroll to bottom of the message container
  useEffect(() => {
    const pageLength = data?.pages.length || 0;
    if (pageLength === 1 && containerRef.current && shouldScroll) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
      });
      disableChatScroll();
    }
  }, [data, shouldScroll]);

  useEffect(() => {
    enableChatScroll();
    return () => {
      enableChatScroll();
    };
  }, [query.id]);

  if (!hasFriendId || !friendInfo) return null;

  if (!data) return <div>No data</div>;
  const chatMessages = data.pages.reduce<Chats[]>((prevChats, page) => {
    return [...page.items, ...prevChats];
  }, []);

  const scrollHandler = (): void => {
    const element = containerRef.current;
    const handler = throttle(fetchNextPage);
    if (element) {
      if (element.scrollTop < 100 && !isFetchingNextPage) {
        handler();
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        maxHeight: 1,
        overflowY: 'auto',
      }}
      onScroll={scrollHandler}
      ref={containerRef}
    >
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
          {isFetchingNextPage && (
            <Typography
              align="center"
              sx={{ mb: 2, display: 'block' }}
              variant="content"
              color="text.secondary"
              fontWeight="Medium"
            >
              Getting previous messages...
            </Typography>
          )}
          <ChatMessageList
            friendName={friendInfo.fullName}
            chatMessages={chatMessages}
          />
        </Box>

        <ChatMessageBox friendId={friendInfo.friendId} />
      </Box>
    </Box>
  );
};