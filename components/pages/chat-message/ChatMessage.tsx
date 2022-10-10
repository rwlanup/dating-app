import { Box, Typography } from '@mui/material';
import { Chats } from '@prisma/client';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef } from 'react';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { useStore } from '../../../hooks/useStore';
import { chatUIStore, disableChatScroll, enableChatScroll } from '../../../store/chatUIStore';
import { throttle } from '../../../util/callback';
import { trpc } from '../../../util/trpc';
import { ErrorScreen } from '../error-screen/ErrorScreen';
import { ChatMessageBox } from './ChatMessageBox';
import { ChatMessageHeader } from './ChatMessageHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatMessageSkeleton } from './ChatMessageSkeleton';

export const ChatMessage: FC = () => {
  const { query, isReady } = useRouter();
  const shouldScroll = useStore(
    chatUIStore,
    (state) => state.shouldScroll,
    () => true
  );
  const containerRef = useRef<HTMLDivElement>();
  const hasFriendId = typeof query.id === 'string';
  const { friends, isLoading: friendsListLoading } = useFriendsList(false);

  const friend = friends?.find((friend) => friend.id === (query.id as string));

  const { isLoading, data, isError, error, fetchNextPage, isFetchingNextPage, isIdle } = trpc.useInfiniteQuery(
    ['chats.messagesByFriendId', { friendId: query.id as string }],
    {
      enabled: Boolean(hasFriendId && friend),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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

  // Handle error state
  if (isError) {
    return (
      <ErrorScreen
        title="500 server error"
        message={error?.message}
        hideBtn
      />
    );
  }

  // Loading state of UI
  if (friendsListLoading || isLoading || !isReady) return <ChatMessageSkeleton />;

  // In friend id supplied to URL
  if (isIdle || !hasFriendId || !friend) return null;

  // Handling loading state of data
  if (!data) return <ChatMessageSkeleton />;

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
      component="section"
    >
      <ChatMessageHeader
        id={friend.id}
        friendProfile={friend.profile}
      />
      <Box
        sx={{
          position: 'relative',
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
            friendName={friend.profile.fullName}
            chatMessages={chatMessages}
            friendId={friend.id}
          />
        </Box>

        <ChatMessageBox friendId={friend.id} />
      </Box>
    </Box>
  );
};
