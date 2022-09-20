import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode, FC } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { RootLayout } from '../components/layouts/root-layout/RootLayout';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '../server/routers/_app';
import { SSRContext } from '../util/trpc';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import superjson from 'superjson';
import { ProfileLayout } from '../components/layouts/profile-layout/ProfileLayout';
import { SnackbarProvider } from 'notistack';
import { ReactQueryDevtools } from 'react-query/devtools';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: FC<AppPropsWithLayout> = ({ Component, pageProps, router }) => {
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
          <SnackbarProvider
            autoHideDuration={3000}
            maxSnack={3}
          >
            <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
          </SnackbarProvider>
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
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
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
