import { Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import pusherJs from 'pusher-js';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { PusherContext } from '../../../context/pusher';
import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';

export const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const [pusher, setPusher] = useState<pusherJs | null>(null);
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      if (!pusher) {
        if (pusherJs.instances.length > 0) {
          setPusher(pusherJs.instances[0]);
        } else {
          setPusher(
            new pusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
              cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
              authEndpoint: '/api/pusher/auth-channel',
              userAuthentication: {
                endpoint: '/api/pusher/auth-user',
                transport: 'ajax',
              },
              forceTLS: true,
            })
          );
        }
      }
    } else {
      if (pusher) {
        pusher.disconnect();
        setPusher(null);
      }
    }
  }, [sessionStatus, pusher]);
  return (
    <PusherContext.Provider value={pusher}>
      <SnackbarProvider
        preventDuplicate
        autoHideDuration={3000}
        maxSnack={3}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '100vh' }}>
          <Header />
          {children}
          <Footer />
        </Box>
      </SnackbarProvider>
    </PusherContext.Provider>
  );
};
