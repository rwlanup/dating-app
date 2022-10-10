import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';

interface VideoCallEndProps {
  reason?: 'ENDED' | 'DISCONNECTED' | 'REJECTED';
}
export const VideoCallEnd: FC<VideoCallEndProps> = ({ reason = 'ENDED' }) => {
  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h3"
        component="span"
        fontWeight="Bold"
      >
        Your call has been {reason.toLowerCase()}.
      </Typography>
      <Link
        passHref
        href="/profile/chats"
      >
        <Button>Go to chats</Button>
      </Link>
    </Box>
  );
};