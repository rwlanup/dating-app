import { AppBar, Box, Button, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import Logo from '../../../public/images/logo.svg';
import { HeaderAuthAction } from './components/HeaderAuthAction';

export const Header: FC = () => {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      variant="outlined"
    >
      <Button
        sx={(theme) => ({
          position: 'absolute',
          top: 80,
          opacity: 0,
          transform: 'translateX(-500px)',
          transition: theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
          '&:focus': {
            opacity: 1,
            transform: 'none',
          },
        })}
      >
        Skip navigation
      </Button>
      <Toolbar>
        <Link
          href="/"
          passHref
        >
          <Box component="a">
            <Image
              src={Logo}
              width={100}
              height={40}
              objectPosition="left center"
              alt="Ditto Logo"
            />
          </Box>
        </Link>
        <Box sx={{ ml: 'auto' }}>
          <HeaderAuthAction />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
