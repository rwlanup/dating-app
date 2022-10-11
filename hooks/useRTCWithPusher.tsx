import { useSession } from 'next-auth/react';
import { Channel } from 'pusher-js';
import { MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PusherContext } from '../context/pusher';

export type CallMode = 'video' | 'text';
export type RTCStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING' | 'DISCONNECTED' | 'ENDED' | 'CONNECTED';
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
      mode: CallMode;
    }
  | {
      type: 'callReject';
      callId: string;
    }
  | {
      type: 'callAccept';
      callId: string;
    }
  | {
      type: 'callEnd';
      callId: string;
    }
  | {
      type: 'callDisconnect';
      callId: string;
    };
export type DataChannelMessage =
  | {
      type: 'signal';
      isVideoOff: boolean;
    }
  | {
      type: 'message';
      content: string;
    };

export type UseRTCWithPusherConfig = {
  channelName: string;
  eventName: string;
  callerId: string;
  receiverId: string;
  callId: string;
} & (
  | {
      mode: 'video';
      friendVideoElRef: MutableRefObject<HTMLVideoElement | undefined>;
      userVideoElRef: MutableRefObject<HTMLVideoElement | undefined>;
    }
  | {
      mode: 'text';
    }
);

export interface UseRTCWithPusherReturns {
  isLoading: boolean;
  isClosed: boolean;
  sentMessages: string[];
  setSentMessages: (newMessages: string[]) => void;
  receivedMessages: string[];
  setReceivedMessages: (newMessages: string[]) => void;
  videoModeStatus: RTCVideoModeStatus;
  toggleMuted: () => void;
  toggleVideo: () => void;
  disconnect: () => void;
  endCall: () => void;
  sendMessage: (message: string) => void;
  status: RTCStatus;
  isCaller: boolean;
}

export interface RTCVideoModeStatus {
  isMuted: boolean;
  isVideoOff: boolean;
  isFriendVideoOff: boolean;
}

const SERVER_CONFIGURATIONS = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};
const CLOSED_RTC_STATUSES: RTCStatus[] = ['DISCONNECTED', 'ENDED', 'REJECTED'];
const DEFAULT_VIDEO_MODE_STATUS: RTCVideoModeStatus = {
  isMuted: false,
  isVideoOff: false,
  isFriendVideoOff: false,
};

export const useRTCWithPusher = (enabled: boolean, config?: UseRTCWithPusherConfig): UseRTCWithPusherReturns => {
  const hasRTCConnectionStartedRef = useRef(false);
  const configRef = useRef<UseRTCWithPusherConfig | undefined>(config);
  const pusher = useContext(PusherContext);
  const channelRef = useRef<Channel>();
  const session = useSession();
  const userId = session.data?.user.id as string;
  const [RTCStatus, setRTCStatus] = useState<RTCStatus>('PENDING');
  const [videoModeStatus, setVideoModeStatus] = useState<RTCVideoModeStatus>(DEFAULT_VIDEO_MODE_STATUS);
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  // Peer connection
  const dataChannelRef = useRef<RTCDataChannel>();
  const friendPeerRef = useRef<RTCPeerConnection>();
  const userPeerRef = useRef<RTCPeerConnection>();
  const friendStreamRef = useRef<MediaStream>();
  const userStreamRef = useRef<MediaStream>();

  // Updating enabled status
  useEffect(() => {
    configRef.current = config;
  }, [config, enabled]);

  const reset = useCallback(() => {
    dataChannelRef.current = undefined;
    friendPeerRef.current = undefined;
    userPeerRef.current = undefined;
    friendStreamRef.current = undefined;
    userStreamRef.current = undefined;
    hasRTCConnectionStartedRef.current = false;
    channelRef.current = undefined;
    setVideoModeStatus(DEFAULT_VIDEO_MODE_STATUS);
    setSentMessages([]);
    setReceivedMessages([]);
  }, []);

  // Bind Event to Data channel
  const bindEventToDataChannel = useCallback(() => {
    if (dataChannelRef.current) {
      dataChannelRef.current.onmessage = (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data) as DataChannelMessage;
        // Check if data is a message
        if (data.type === 'message') {
          setReceivedMessages((prevMessages) => [...prevMessages, data.content]);
          return;
        }
        // Check if signal is based on video toggle
        if (data.type === 'signal' && configRef.current && configRef.current.mode === 'video') {
          setVideoModeStatus((prevState) => ({
            ...prevState,
            isFriendVideoOff: data.isVideoOff,
          }));
        }
      };
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    if (configRef.current && configRef.current.receiverId) {
      userPeerRef.current = new RTCPeerConnection(SERVER_CONFIGURATIONS);
      friendPeerRef.current = new RTCPeerConnection(SERVER_CONFIGURATIONS);

      if (configRef.current.mode === 'video') {
        friendStreamRef.current = new MediaStream();

        // Streaming user video
        const userStream = userStreamRef.current;
        if (userStream) {
          userStream.getTracks().forEach((track) => {
            userPeerRef.current?.addTrack(track, userStream);
          });
        }

        // Stream video
        userPeerRef.current.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            event.streams[0].getTracks().forEach((track) => {
              friendStreamRef.current?.addTrack(track);
            });
          }
        };
      }

      // Handle ice candidate
      userPeerRef.current.onicecandidate = async (event) => {
        if (event.candidate && channelRef.current && configRef.current) {
          channelRef.current.trigger(configRef.current.eventName, {
            callId: configRef.current.callId,
            friendId: configRef.current.receiverId,
            type: 'candidate',
            candidate: event.candidate,
          });
        }
      };

      return userPeerRef.current;
    }
  }, []);

  const createOffer = useCallback(async () => {
    if (!hasRTCConnectionStartedRef.current) {
      const peer = createPeerConnection();
      hasRTCConnectionStartedRef.current = true;
      if (peer && configRef.current) {
        dataChannelRef.current = peer.createDataChannel('chat-channel');
        bindEventToDataChannel();
        // Creating offer
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        if (channelRef.current) {
          channelRef.current.trigger(configRef.current.eventName, {
            type: 'offer',
            offer,
            callId: configRef.current.callId,
            callerId: configRef.current.callerId,
          });
        }
      }
    }
  }, [createPeerConnection, bindEventToDataChannel]);

  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      if (!hasRTCConnectionStartedRef.current) {
        const peer = createPeerConnection();
        hasRTCConnectionStartedRef.current = true;
        if (peer && configRef.current) {
          peer.ondatachannel = (event) => {
            dataChannelRef.current = event.channel;
            bindEventToDataChannel();
          };
          await peer.setRemoteDescription(offer);
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          if (channelRef.current) {
            channelRef.current.trigger(configRef.current.eventName, {
              type: 'answer',
              answer,
            });
          }
        }
      }
    },
    [createPeerConnection, bindEventToDataChannel]
  );

  const addAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!userPeerRef.current) return;
    if (!userPeerRef.current.currentRemoteDescription) {
      await userPeerRef.current.setRemoteDescription(answer);
    }
  }, []);

  const pusherCallback = useCallback(
    async (data: SignalData) => {
      switch (data.type) {
        case 'offer':
          await createAnswer(data.offer);
          setRTCStatus('CONNECTED');
          break;
        case 'answer':
          await addAnswer(data.answer);
          setRTCStatus('CONNECTED');
          break;
        case 'candidate':
          if (
            userPeerRef.current &&
            userPeerRef.current.remoteDescription &&
            userPeerRef.current.signalingState !== 'closed'
          ) {
            userPeerRef.current.addIceCandidate(data.candidate);
          }
          break;
        case 'callAccept':
          setRTCStatus('ACCEPTED');
          break;
        case 'callReject':
          setRTCStatus('REJECTED');
          break;
        case 'callDisconnect':
          setRTCStatus((prevStatus) => {
            if (CLOSED_RTC_STATUSES.includes(prevStatus)) {
              return prevStatus;
            }
            return 'DISCONNECTED';
          });
          break;
        case 'callEnd':
          setRTCStatus('ENDED');
          break;
      }
    },
    [createAnswer, addAnswer]
  );

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (userPeerRef.current) {
      userPeerRef.current.close();
    }
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (channelRef.current && configRef.current) {
      channelRef.current.unbind(configRef.current.eventName, pusherCallback);
    }
    reset();
  }, [reset, pusherCallback]);

  useEffect(() => {
    if (CLOSED_RTC_STATUSES.includes(RTCStatus)) {
      stopStreaming();
    }
  }, [RTCStatus, stopStreaming]);

  // Handling video preview
  useEffect(() => {
    if (RTCStatus === 'CONNECTED' && configRef.current && configRef.current.mode === 'video') {
      if (configRef.current.userVideoElRef.current) {
        configRef.current.userVideoElRef.current.srcObject = userStreamRef.current || null;
      }
      if (configRef.current.friendVideoElRef.current) {
        configRef.current.friendVideoElRef.current.srcObject = friendStreamRef.current || null;
      }
    }
  }, [RTCStatus]);

  const disconnect = useCallback(() => {
    if (channelRef.current && configRef.current) {
      channelRef.current.trigger(configRef.current.eventName, {
        type: 'callDisconnect',
        callId: configRef.current.callId,
      } as SignalData);
    }
    setRTCStatus('DISCONNECTED');
  }, []);

  // Disconnect on window close
  useEffect(() => {
    if (channelRef.current) {
      window.addEventListener('beforeunload', disconnect);
    }
    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, [disconnect]);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Handling accepted calls by caller
  useEffect(() => {
    (async () => {
      if (
        configRef.current &&
        userId === configRef.current.callerId &&
        RTCStatus === 'ACCEPTED' &&
        !hasRTCConnectionStartedRef.current
      ) {
        if (configRef.current.mode === 'video') {
          userStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        }
        await createOffer();
      }
    })();
  }, [createOffer, RTCStatus, userId]);

  // Init call receiving or calling
  useEffect(() => {
    (async () => {
      if (pusher && RTCStatus === 'PENDING' && enabled && configRef.current) {
        if (!channelRef.current) {
          channelRef.current =
            pusher.channel(configRef.current.channelName) || pusher.subscribe(configRef.current.channelName);
        }
        channelRef.current.bind(configRef.current.eventName, pusherCallback);
        // Accept call if current user is not a caller
        if (userId !== configRef.current.callerId) {
          if (configRef.current.mode === 'video') {
            userStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          }
          channelRef.current.trigger(configRef.current.eventName, {
            type: 'callAccept',
            callId: configRef.current.callId,
          } as SignalData);
          setRTCStatus('ACCEPTED');
        } else {
          // Send call if current user is a caller
          channelRef.current.trigger(configRef.current.eventName, {
            type: 'callOffer',
            callId: configRef.current.callId,
            callerId: configRef.current.callerId,
            mode: configRef.current.mode,
          } as SignalData);
        }
      }
    })();
  }, [pusher, RTCStatus, userId, enabled, pusherCallback]);

  const endCall = useCallback(() => {
    if (channelRef.current && configRef.current) {
      channelRef.current.trigger(configRef.current.eventName, {
        type: 'callEnd',
        callId: configRef.current.callId,
      } as SignalData);
    }
    setRTCStatus('ENDED');
  }, []);

  const toggleMuted = useCallback(() => {
    if (configRef.current && configRef.current.mode === 'video') {
      setVideoModeStatus((prevStatus) => {
        if (userStreamRef.current) {
          const audioTrack = userStreamRef.current.getTracks().find((track) => track.kind === 'audio');
          if (audioTrack) {
            audioTrack.enabled = prevStatus.isMuted;
          }
        }
        return {
          ...prevStatus,
          isMuted: !prevStatus.isMuted,
        };
      });
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (configRef.current && configRef.current.mode === 'video') {
      setVideoModeStatus((prevStatus) => {
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
          dataChannelRef.current.send(
            JSON.stringify({
              type: 'signal',
              isVideoOff: !prevStatus.isVideoOff,
            } as DataChannelMessage)
          );
        }
        if (userStreamRef.current) {
          const videoTrack = userStreamRef.current.getTracks().find((track) => track.kind === 'video');
          if (videoTrack) {
            videoTrack.enabled = prevStatus.isVideoOff;
          }
        }
        return {
          ...prevStatus,
          isVideoOff: !prevStatus.isVideoOff,
        };
      });
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      setSentMessages((prevMessages) => [...prevMessages, message]);
      dataChannelRef.current.send(
        JSON.stringify({
          type: 'message',
          content: message,
        } as DataChannelMessage)
      );
    }
  }, []);

  const isLoading = RTCStatus === 'PENDING';
  const isClosed = CLOSED_RTC_STATUSES.includes(RTCStatus);

  return {
    isLoading,
    isClosed,
    sentMessages,
    setSentMessages,
    receivedMessages,
    setReceivedMessages,
    videoModeStatus,
    toggleMuted,
    toggleVideo,
    disconnect,
    endCall,
    sendMessage,
    status: RTCStatus,
    isCaller: userId === configRef.current?.callerId,
  };
};
