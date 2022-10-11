import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';
import { RTCStatus } from '../../../hooks/useRTCWithPusher';

interface VideoCallEndProps {
  reason?: RTCStatus;
  isChat?: boolean;
}
export const VideoCallEnd: FC<VideoCallEndProps> = ({ reason = 'ENDED', isChat }) => {
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
        Your {isChat ? 'chat' : 'call'} has been {reason.toLowerCase()}.
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
