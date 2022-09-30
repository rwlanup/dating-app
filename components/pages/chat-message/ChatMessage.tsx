import { Box } from '@mui/material';
import { Chats } from '@prisma/client';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef } from 'react';
import { useStore } from '../../../hooks/useStore';
import { chatUIStore, disableChatScroll } from '../../../store/chatUIStore';
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
  const hasAttachedEventToContainer = useRef(false);
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
  const hasData = Boolean(data);

  // Handling fetching previous messages
  useEffect(() => {
    const element = containerRef.current;
    if (element && hasData && !hasAttachedEventToContainer.current) {
      const handler = throttle(() => {
        if (element.scrollTop < 100 && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      element.addEventListener('scroll', handler);
      hasAttachedEventToContainer.current = true;
    }
  }, [fetchNextPage, hasData, isFetchingNextPage]);

  if (!hasFriendId || !friendInfo) return null;

  if (!data) return <div>No data</div>;
  const chatMessages = data.pages.reduce<Chats[]>((prevChats, page) => {
    return [...page.items, ...prevChats];
  }, []);

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
