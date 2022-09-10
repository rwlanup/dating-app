import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { RootLayout } from './components/layouts';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode, FC } from 'react';

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
      <div className="bg-white">
        <RootLayout>
          {getLayout(<Component {...pageProps} />)}
          <div id="dialog-root"></div>
        </RootLayout>
      </div>
    </SessionProvider>
  );
};

export default MyApp;
