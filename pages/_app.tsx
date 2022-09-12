import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode, FC } from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { RootLayout } from '../components/layouts/root-layout/RootLayout';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default MyApp;
