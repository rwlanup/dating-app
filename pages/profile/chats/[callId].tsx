import { Box, CircularProgress } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { VideoCall } from '../../../components/pages/video-call/VideoCall';
import { Channel } from 'pusher-js';
import { PusherContext } from '../../../context/pusher';

const SERVERS = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export type SignalData =
  | {
      type: 'answer';
      answer: RTCSessionDescriptionInit;
    }
  | {
      type: 'offer';
      offer: RTCSessionDescriptionInit;
      callId: string;
      callerId: string;
    }
  | {
      type: 'candidate';
      candidate: RTCIceCandidate;
    };

const CallPage: NextPage = () => {
  const pusher = useContext(PusherContext);
  // URL and User data
  const router = useRouter();
  const callId = router.query.callId;
  const friendId = router.query.friendId;
  const callerId = router.query.callerId;
  const channelRef = useRef<Channel>();
  const session = useSession();
  const userId = session.data?.user.id;

  // UI State
  const { isLoading: friendsListLoading, friends } = useFriendsList();
  const friend = friends?.find((friend) => friend.id === friendId);
  const [isLoading, setIsLoading] = useState(true);
  const userVideoElRef = useRef<HTMLVideoElement>();
  const friendVideoElRef = useRef<HTMLVideoElement>();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFriendVideoOff, setIsFriendVideoOff] = useState(false);

  // Peer connection
  const friendPeerRef = useRef<RTCPeerConnection>();
  const userPeerRef = useRef<RTCPeerConnection>();
  const friendStreamRef = useRef<MediaStream>();
  const userStreamRef = useRef<MediaStream>();

  const createPeerConnection = useCallback(() => {
    if (friend) {
      userPeerRef.current = new RTCPeerConnection(SERVERS);
      friendPeerRef.current = new RTCPeerConnection(SERVERS);
      friendStreamRef.current = new MediaStream();
      if (friendVideoElRef.current) {
        friendVideoElRef.current.srcObject = friendStreamRef.current;
      }

      // Streaming user video
      const userStream = userStreamRef.current;
      if (userStream) {
        userStream.getTracks().forEach((track) => userPeerRef.current?.addTrack(track, userStream));
      }

      userPeerRef.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          friendStreamRef.current?.addTrack(track);
        });
      };

      userPeerRef.current.onicecandidate = async (event) => {
        if (event.candidate && channelRef.current) {
          channelRef.current.trigger(`client-call-${friendId}`, {
            callId,
            friendId: friend.id,
            type: 'candidate',
            candidate: event.candidate,
          });
        }
      };

      return userPeerRef.current;
    }
  }, [callId, friend, friendId]);

  const createOffer = useCallback(async () => {
    const peer = createPeerConnection();
    if (peer) {
      // Creating offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      if (channelRef.current) {
        channelRef.current.trigger(`client-call-${friendId}`, {
          type: 'offer',
          offer,
          callId,
          callerId,
        });
      }
    }
  }, [createPeerConnection, friendId, callId, callerId]);

  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      const peer = createPeerConnection();
      if (peer) {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        if (channelRef.current) {
          channelRef.current.trigger(`client-call-${friendId}`, {
            type: 'answer',
            answer,
          });
        }
      }
    },
    [createPeerConnection, friendId]
  );

  const addAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!userPeerRef.current) return;
    if (!userPeerRef.current.currentRemoteDescription) {
      userPeerRef.current.setRemoteDescription(answer);
    }
  }, []);

  useEffect(() => {
    async function init() {
      if (friend) {
        userStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (userVideoElRef.current) {
          userVideoElRef.current.srcObject = userStreamRef.current;
        }
        if (typeof callerId === 'string' && userId === callerId) {
          createOffer();
        }
      }
    }
    if (friend && userId && callerId && pusher) {
      channelRef.current = pusher.channel(`private-${friend.id}`) || pusher.subscribe(`private-${friend.id}`);
      channelRef.current.bind(`client-call-${friend.id}`, (data: SignalData) => {
        switch (data.type) {
          case 'offer':
            createAnswer(data.offer);
            break;
          case 'answer':
            addAnswer(data.answer);
            setIsLoading(false);
            break;
          case 'candidate':
            if (userPeerRef.current && userPeerRef.current.remoteDescription) {
              userPeerRef.current.addIceCandidate(data.candidate);
            }
            break;
        }
      });
      if (channelRef.current.subscribed) {
        init();
      } else {
        channelRef.current.bind('pusher:subscription_succeeded', init);
      }
    }
    return () => {
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (channelRef.current && friend) {
        channelRef.current.unbind(`client-call-${friend.id}`);
      }
    };
  }, [isLoading, friend, createOffer, addAnswer, createAnswer, callerId, userId, pusher]);

  if (friendsListLoading || !friend)
    return (
      <Box sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={100} />
      </Box>
    );

  const toggleMuted = () => {
    setIsMuted((prevStatus) => {
      if (userStreamRef.current) {
        const audioTrack = userStreamRef.current.getTracks().find((track) => track.kind === 'audio');
        if (audioTrack) {
          audioTrack.enabled = prevStatus;
        }
      }
      return !prevStatus;
    });
  };

  const toggleVideo = () => {
    setIsVideoOff((prevStatus) => {
      if (userStreamRef.current) {
        const videoTrack = userStreamRef.current.getTracks().find((track) => track.kind === 'video');
        if (videoTrack) {
          videoTrack.enabled = prevStatus;
        }
      }
      return !prevStatus;
    });
  };

  return (
    <VideoCall
      friendVideoElRef={friendVideoElRef}
      userVideoElRef={userVideoElRef}
      isMuted={isMuted}
      isVideoOff={isVideoOff}
      isFriendVideoOff={isFriendVideoOff}
      toggleMuted={toggleMuted}
      toggleVideo={toggleVideo}
      friendProfile={friend.profile}
    />
  );
};

export default CallPage;