import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { VideoCall } from '../../../components/pages/video-call/VideoCall';
import { VideoCallLoading } from '../../../components/pages/video-call/VideoCallLoading';
import { VideoCallEnd } from '../../../components/pages/video-call/VideoCallEnd';
import { useRTCWithPusher, UseRTCWithPusherConfig } from '../../../hooks/useRTCWithPusher';
import { ApprovedFriendWithFirstChat } from '../../../types/friend';

const CallPage: NextPage = () => {
  // URL and User data
  const router = useRouter();
  const callId = router.query.callId;
  const friendId = router.query.friendId;
  const callerId = router.query.callerId;

  // UI State
  const { isLoading: friendsListLoading, friends } = useFriendsList();
  const friend = useMemo(() => friends?.find((friend) => friend.id === friendId), [friendId, friends]);
  const userVideoElRef = useRef<HTMLVideoElement>();
  const friendVideoElRef = useRef<HTMLVideoElement>();

  const isEnabled: boolean =
    (friend && !friendsListLoading && typeof callerId === 'string' && typeof callId === 'string') || false;

  const RTCConfig = useMemo<UseRTCWithPusherConfig | undefined>(() => {
    if (!isEnabled) return undefined;

    return {
      callerId: callerId as string,
      receiverId: (friend as ApprovedFriendWithFirstChat).profile.id,
      callId: callId as string,
      channelName: `private-${(friend as ApprovedFriendWithFirstChat).id}`,
      eventName: `client-call-${(friend as ApprovedFriendWithFirstChat).id}`,
      friendVideoElRef,
      mode: 'video',
      userVideoElRef,
    };
  }, [isEnabled, friend, callId, callerId]);

  const { endCall, isClosed, isLoading, toggleMuted, toggleVideo, videoModeStatus, status, isCaller } =
    useRTCWithPusher(isEnabled, RTCConfig);

  if (isClosed) {
    return <VideoCallEnd reason={status} />;
  }

  if (isLoading || !(status === 'ACCEPTED' || status === 'CONNECTED') || !isEnabled)
    return (
      <VideoCallLoading
        isCaller={isCaller}
        onCallEnd={endCall}
        name={friend?.profile.fullName}
      />
    );
  return (
    <VideoCall
      friendVideoElRef={friendVideoElRef}
      userVideoElRef={userVideoElRef}
      isMuted={videoModeStatus.isMuted}
      isVideoOff={videoModeStatus.isVideoOff}
      isFriendVideoOff={videoModeStatus.isFriendVideoOff}
      toggleMuted={toggleMuted}
      toggleVideo={toggleVideo}
      endCall={endCall}
      friendProfile={(friend as ApprovedFriendWithFirstChat).profile}
    />
  );
};

export default CallPage;
