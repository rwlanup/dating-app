import { Box } from '@mui/material';
import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ChatMessageBox } from '../../../components/pages/chat-message/ChatMessageBox';
import { ChatMessageHeader } from '../../../components/pages/chat-message/ChatMessageHeader';
import { ChatMessageList } from '../../../components/pages/chat-message/ChatMessageList';
import { ChatMessageSkeleton } from '../../../components/pages/chat-message/ChatMessageSkeleton';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { useRTCWithPusher, UseRTCWithPusherConfig } from '../../../hooks/useRTCWithPusher';
import { ApprovedFriendWithFirstChat } from '../../../types/friend';

const PrivateChatMessagePage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const friendId = router.query.friendId;
  const senderId = router.query.senderId;
  const { isLoading: friendsListLoading, friends } = useFriendsList(false);
  const friend = useMemo(() => friends?.find((friend) => friend.id === friendId), [friendId, friends]);
  const isEnabled: boolean =
    (friend && !friendsListLoading && typeof senderId === 'string' && Boolean(session?.user)) || false;

  const RTCConfig = useMemo<UseRTCWithPusherConfig | undefined>(() => {
    if (!isEnabled) return undefined;

    return {
      callerId: senderId as string,
      receiverId: (friend as ApprovedFriendWithFirstChat).profile.id,
      callId: (friend as ApprovedFriendWithFirstChat).id as string,
      channelName: `private-${(friend as ApprovedFriendWithFirstChat).id}`,
      eventName: `client-call-${(friend as ApprovedFriendWithFirstChat).id}`,
      mode: 'text',
      friendId: (friend as ApprovedFriendWithFirstChat).id as string,
      userId: (session as Session).user.id,
    };
  }, [isEnabled, friend, senderId, session]);

  const { endCall, isClosed, isLoading, status, sendMessage, messages } = useRTCWithPusher(isEnabled, RTCConfig);

  if (isLoading || !(status === 'ACCEPTED' || status === 'CONNECTED') || !isEnabled) {
    return <ChatMessageSkeleton />;
  }
  return (
    <Box
      sx={{
        bgcolor: 'common.black',
        height: 1,
        width: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        color: 'common.white',
      }}
    >
      <ChatMessageHeader
        sx={{ bgcolor: 'grey.900' }}
        friendProfile={(friend as ApprovedFriendWithFirstChat).profile}
        id={(friend as ApprovedFriendWithFirstChat).id}
        hideBtn
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
          <ChatMessageList
            chatMessages={messages}
            friendName={(friend as ApprovedFriendWithFirstChat).profile.fullName}
            friendId={(friend as ApprovedFriendWithFirstChat).id}
          />
        </Box>

        <ChatMessageBox
          isPrivate
          friendId={(friend as ApprovedFriendWithFirstChat).id}
          onSend={sendMessage}
        />
      </Box>
    </Box>
  );
};

export default PrivateChatMessagePage;
