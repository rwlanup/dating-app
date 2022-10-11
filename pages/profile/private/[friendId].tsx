import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { useRTCWithPusher, UseRTCWithPusherConfig } from '../../../hooks/useRTCWithPusher';
import { ApprovedFriendWithFirstChat } from '../../../types/friend';

const PrivateChatMessagePage: NextPage = () => {
  const router = useRouter();
  const friendId = router.query.friendId;
  const senderId = router.query.senderId;
  const { isLoading: friendsListLoading, friends } = useFriendsList(false);
  const friend = useMemo(() => friends?.find((friend) => friend.id === friendId), [friendId, friends]);
  const isEnabled: boolean = (friend && !friendsListLoading && typeof senderId === 'string') || false;

  const RTCConfig = useMemo<UseRTCWithPusherConfig | undefined>(() => {
    if (!isEnabled) return undefined;

    return {
      callerId: senderId as string,
      receiverId: (friend as ApprovedFriendWithFirstChat).profile.id,
      callId: (friend as ApprovedFriendWithFirstChat).id as string,
      channelName: `private-${(friend as ApprovedFriendWithFirstChat).id}`,
      eventName: `client-call-${(friend as ApprovedFriendWithFirstChat).id}`,
      mode: 'text',
    };
  }, [isEnabled, friend, senderId]);

  const { endCall, isClosed, isLoading, toggleMuted, toggleVideo, videoModeStatus, status, isCaller } =
    useRTCWithPusher(isEnabled, RTCConfig);

  return <div>index</div>;
};

export default PrivateChatMessagePage;
