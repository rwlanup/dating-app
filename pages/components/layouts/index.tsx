import { PropsWithChildren, FC } from 'react';
import Header from './header/Header';

export const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
    </>
  );
};
