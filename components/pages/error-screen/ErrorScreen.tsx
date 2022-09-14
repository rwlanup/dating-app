import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';

interface ErrorScreenProps {
  title: string;
  message?: string;
}

export const ErrorScreen: FC<ErrorScreenProps> = ({ title, message }) => {
  return (
    <Container sx={{ py: 5, height: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 1, justifyContent: 'center' }}>
        <Typography variant="h1">{title}</Typography>
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
        <Box sx={{ mt: 2 }}>
          <Link
            href="/"
            passHref
          >
            <Button>Go to home</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};
