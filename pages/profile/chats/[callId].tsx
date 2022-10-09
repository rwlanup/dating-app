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
type CallStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING';
export type SignalData =
  | {
      type: 'answer';
      answer: RTCSessionDescriptionInit;
    }
  | {
      type: 'offer';
      offer: RTCSessionDescriptionInit;
    }
  | {
      type: 'candidate';
      candidate: RTCIceCandidate;
    }
  | {
      type: 'callOffer';
      callId: string;
      callerId: string;
    }
  | {
      type: 'callReject';
      callId: string;
    }
  | {
      type: 'callAccept';
      callId: string;
    };
export type DataChannelMessage =
  | {
      type: 'signal';
      video: boolean;
    }
  | {
      type: 'message';
      content: string;
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
  const [callStatus, setCallStatus] = useState<CallStatus>('PENDING');
  const [isLoading, setIsLoading] = useState(true);
  const userVideoElRef = useRef<HTMLVideoElement>();
  const friendVideoElRef = useRef<HTMLVideoElement>();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFriendVideoOff, setIsFriendVideoOff] = useState(false);

  // Peer connection
  const dataChannelRef = useRef<RTCDataChannel>();
  const friendPeerRef = useRef<RTCPeerConnection>();
  const userPeerRef = useRef<RTCPeerConnection>();
  const friendStreamRef = useRef<MediaStream>();
  const userStreamRef = useRef<MediaStream>();

  const bindEventToDataChannel = useCallback(() => {
    if (dataChannelRef.current) {
      dataChannelRef.current.onmessage = (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data) as DataChannelMessage;
        if (data.type === 'signal') {
          setIsFriendVideoOff(data.video);
        }
      };
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    if (friend) {
      userPeerRef.current = new RTCPeerConnection(SERVERS);
      friendPeerRef.current = new RTCPeerConnection(SERVERS);
      friendStreamRef.current = new MediaStream();

      // Streaming user video
      const userStream = userStreamRef.current;
      if (userStream) {
        userStream.getTracks().forEach((track) => {
          userPeerRef.current?.addTrack(track, userStream);
        });
      }

      userPeerRef.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          event.streams[0].getTracks().forEach((track) => {
            friendStreamRef.current?.addTrack(track);
          });
        }
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
      dataChannelRef.current = peer.createDataChannel('chat-channel');
      bindEventToDataChannel();
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
  }, [createPeerConnection, friendId, callId, callerId, bindEventToDataChannel]);

  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      const peer = createPeerConnection();
      if (peer) {
        peer.ondatachannel = (event) => {
          dataChannelRef.current = event.channel;
          bindEventToDataChannel();
        };
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
    [createPeerConnection, friendId, bindEventToDataChannel]
  );

  const addAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!userPeerRef.current) return;
    if (!userPeerRef.current.currentRemoteDescription) {
      await userPeerRef.current.setRemoteDescription(answer);
    }
  }, []);

  // Attach events to channel
  useEffect(() => {
    if (pusher && friend) {
      channelRef.current = pusher.channel(`private-${friend.id}`) || pusher.subscribe(`private-${friend.id}`);
      channelRef.current.bind(`client-call-${friend.id}`, async (data: SignalData) => {
        switch (data.type) {
          case 'offer':
            await createAnswer(data.offer);
            setIsLoading(false);
            break;
          case 'answer':
            await addAnswer(data.answer);
            setIsLoading(false);
            break;
          case 'candidate':
            if (userPeerRef.current && userPeerRef.current.remoteDescription) {
              userPeerRef.current.addIceCandidate(data.candidate);
            }
            break;
          case 'callAccept':
            setCallStatus('ACCEPTED');
            break;
          case 'callReject':
            setCallStatus('REJECTED');
            break;
        }
      });
    }

    return () => {
      if (channelRef.current && friend) {
        channelRef.current.unbind(`client-call-${friend.id}`);
      }

      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [pusher, friend, addAnswer, createAnswer]);

  // Handling video preview
  useEffect(() => {
    if (callStatus === 'ACCEPTED' && !isLoading) {
      if (userVideoElRef.current) {
        userVideoElRef.current.srcObject = userStreamRef.current || null;
      }
      if (friendVideoElRef.current) {
        friendVideoElRef.current.srcObject = friendStreamRef.current || null;
      }
    }
  }, [callStatus, isLoading]);

  // Handling accepted calls
  useEffect(() => {
    (async () => {
      if (typeof callerId === 'string' && userId === callerId && callStatus === 'ACCEPTED') {
        userStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        await createOffer();
      }
    })();
  }, [callerId, userId, createOffer, callStatus]);

  // Handling calls
  useEffect(() => {
    (async () => {
      if (pusher && friend && callStatus !== 'ACCEPTED' && typeof callerId === 'string') {
        if (!channelRef.current) {
          channelRef.current = pusher.channel(`private-${friend.id}`) || pusher.subscribe(`private-${friend.id}`);
        }
        // Accept call if current user is not a caller
        if (userId !== callerId) {
          userStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          channelRef.current.trigger(`client-call-${friend.id}`, {
            type: 'callAccept',
            callId,
          } as SignalData);
          setCallStatus('ACCEPTED');
        } else {
          // Send call if current user is a caller
          channelRef.current.trigger(`client-call-${friend.id}`, {
            type: 'callOffer',
            callId,
            callerId,
          } as SignalData);
        }
      }
    })();
  }, [pusher, friend, callStatus, callerId, userId, callId]);

  if (friendsListLoading || !friend || isLoading || callStatus !== 'ACCEPTED')
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
      if (dataChannelRef.current) {
        if (dataChannelRef.current.readyState === 'open') {
          dataChannelRef.current.send(
            JSON.stringify({
              type: 'signal',
              video: !prevStatus,
            })
          );
        }
      }
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
