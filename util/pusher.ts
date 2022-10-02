import pusherJs from 'pusher-js';

export const pusher = new pusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: '/api/pusher/auth-channel',
  userAuthentication: {
    endpoint: '/api/pusher/auth-user',
    transport: 'ajax',
  },
  forceTLS: true,
});
