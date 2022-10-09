import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ReactElement, ReactNode, FC, useRef, useEffect, useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { RootLayout } from '../components/layouts/root-layout/RootLayout';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '../server/routers/_app';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import superjson from 'superjson';
import { ProfileLayout } from '../components/layouts/profile-layout/ProfileLayout';
import { SnackbarProvider } from 'notistack';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PusherContext } from '../context/pusher';
import pusherJs from 'pusher-js';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: FC<AppPropsWithLayout> = ({ Component, pageProps, router }) => {
  const [pusher, setPusher] = useState<pusherJs | null>(null);

  useEffect(() => {
    if (router.pathname.startsWith('/profile')) {
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
  }, [router.pathname, pusher]);

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) =>
      router.pathname.startsWith('/profile') ? (
        <ProfileLayout page={page} />
      ) : (
        <Box
          component="main"
          id="main"
          sx={{ flex: '1 0 auto' }}
        >
          {page}
        </Box>
      ));

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <PusherContext.Provider value={pusher}>
            <SnackbarProvider
              preventDuplicate
              autoHideDuration={3000}
              maxSnack={3}
            >
              <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
            </SnackbarProvider>
          </PusherContext.Provider>
        </ThemeProvider>
      </SessionProvider>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom-right"
      />
    </>
  );
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
