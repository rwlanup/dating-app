import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';
import VolumeOffTwoToneIcon from '@mui/icons-material/VolumeOffTwoTone';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';
import { trpc } from '../../../util/trpc';

const CallPage: NextPage = () => {
  const [isFriendVideoOff, setIsFriendVideoOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const router = useRouter();
  const callId = router.query.callId;

  const toggleMuted = () => {
    setIsMuted((prevState) => !prevState);
  };
  const toggleVideoOff = () => {
    setIsVideoOff((prevState) => !prevState);
  };

  return (
    <Box sx={{ position: 'relative', height: 1 }}>
      <Box
        sx={{
          position: 'absolute',
          height: 1,
          width: 1,
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isFriendVideoOff ? (
          <Box sx={{ mt: '10vh' }}>
            <Avatar
              alt="Anup Rawal"
              sx={{ height: 200, width: 200, mx: 'auto', mb: 2 }}
            />
            <Typography
              align="center"
              variant="h4"
              fontWeight="Bold"
              component="h1"
            >
              Anup Rawal
            </Typography>
          </Box>
        ) : (
          <Box
            component="video"
            sx={{ height: 1, width: 1, position: 'absolute', bgcolor: 'common.black', borderRadius: 3 }}
          />
        )}
        <Box
          sx={{
            mt: 'auto',
            mb: 2,
            display: 'flex',
            alignSelf: 'center',
            gap: 2,
            justifyContent: 'center',
            bgcolor: 'common.white',
            zIndex: 20,
            borderRadius: 9999,
          }}
        >
          <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
            <IconButton
              sx={{ '&:focus': { boxShadow: 'none!important' } }}
              onClick={toggleMuted}
              size="large"
              color="primary"
            >
              {isMuted ? <VolumeOffTwoToneIcon /> : <VolumeUpTwoToneIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isVideoOff ? 'Turn on video' : 'Turn off video'}>
            <IconButton
              sx={{ '&:focus': { boxShadow: 'none!important' } }}
              onClick={toggleVideoOff}
              size="large"
              color="primary"
            >
              {isVideoOff ? <VideocamOffTwoToneIcon /> : <VideocamTwoToneIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="End call">
            <IconButton
              sx={{ '&:focus': { boxShadow: 'none!important' } }}
              size="large"
              color="primary"
            >
              <CallEndTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {!isVideoOff && (
        <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
          <Box
            component="video"
            muted
            sx={{ height: 120, width: 160, borderRadius: 1, bgcolor: 'common.white', boxShadow: 3 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CallPage;
