import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import type { FC, ReactElement } from 'react';

interface ErrorScreenProps {
  title: string;
  message?: string;
  hideBtn?: boolean;
  icon?: ReactElement;
}

export const ErrorScreen: FC<ErrorScreenProps> = ({ title, message, hideBtn, icon }) => {
  return (
    <Container sx={{ py: 5 }}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '55vh',
          flexDirection: 'column',
          alignItems: 'center',
          height: 1,
          justifyContent: 'center',
        }}
      >
        {icon}
        <Typography
          align="center"
          variant="h1"
        >
          {title}
        </Typography>
        {message && (
          <Typography
            variant="body"
            paragraph
            align="center"
            sx={{ mt: 1 }}
            color="error"
          >
            {message}
          </Typography>
        )}
        {!hideBtn && (
          <Box sx={{ mt: 2 }}>
            <Link
              href="/"
              passHref
            >
              <Button>Go to home</Button>
            </Link>
          </Box>
        )}
      </Box>
    </Container>
  );
};
