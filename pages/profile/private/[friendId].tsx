import { Box } from '@mui/material';
import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';
import { ChatMessageBox } from '../../../components/pages/chat-message/ChatMessageBox';
import { ChatMessageHeader } from '../../../components/pages/chat-message/ChatMessageHeader';
import { ChatMessageList } from '../../../components/pages/chat-message/ChatMessageList';
import { ChatMessageSkeleton } from '../../../components/pages/chat-message/ChatMessageSkeleton';
import { VideoCallEnd } from '../../../components/pages/video-call/VideoCallEnd';
import { VideoCallLoading } from '../../../components/pages/video-call/VideoCallLoading';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { useRTCWithPusher, UseRTCWithPusherConfig } from '../../../hooks/useRTCWithPusher';
import { ApprovedFriendWithFirstChat } from '../../../types/friend';

const PrivateChatMessagePage: NextPage = () => {
  const containerRef = useRef<HTMLDivElement>();
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

  const { endCall, isClosed, isLoading, status, sendMessage, messages, isCaller } = useRTCWithPusher(
    isEnabled,
    RTCConfig
  );
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isClosed) {
    return (
      <VideoCallEnd
        isChat
        reason={status}
      />
    );
  }

  if (isLoading || !(status === 'ACCEPTED' || status === 'CONNECTED') || !isEnabled) {
    return (
      <VideoCallLoading
        isCaller={isCaller}
        name={friend?.profile.fullName}
        onCallEnd={endCall}
      />
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        bgcolor: 'common.black',
        height: 1,
        width: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        color: 'common.white',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 1,
        overflowY: 'auto',
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
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ px: { xs: 2, xl: 3 }, py: 2 }}>
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
