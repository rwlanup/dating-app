import { Box } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';
import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';

export const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '100vh' }}>
      <Header />
      <Box
        component="main"
        id="main"
        sx={{ flex: '1 0 auto' }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
