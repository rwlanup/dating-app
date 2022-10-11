import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ReactElement, ReactNode, FC, useEffect } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { RootLayout } from '../components/layouts/root-layout/RootLayout';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '../server/routers/_app';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import superjson from 'superjson';
import { ProfileLayout } from '../components/layouts/profile-layout/ProfileLayout';
import { ReactQueryDevtools } from 'react-query/devtools';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: FC<AppPropsWithLayout> = ({ Component, pageProps, router }) => {
  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      // Remove the event handler on unmount!
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

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
          <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
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
