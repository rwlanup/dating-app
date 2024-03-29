import type { FC, MutableRefObject } from 'react';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';
import VolumeOffTwoToneIcon from '@mui/icons-material/VolumeOffTwoTone';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';
import { ApprovedFriendWithFirstChat } from '../../../types/friend';

interface VideoCallProps {
  friendVideoElRef: MutableRefObject<HTMLVideoElement | undefined>;
  userVideoElRef: MutableRefObject<HTMLVideoElement | undefined>;
  isMuted: boolean;
  isVideoOff: boolean;
  isFriendVideoOff: boolean;
  toggleMuted: () => void;
  toggleVideo: () => void;
  endCall: () => void;
  friendProfile: ApprovedFriendWithFirstChat['profile'];
}

export const VideoCall: FC<VideoCallProps> = ({
  friendVideoElRef,
  userVideoElRef,
  isMuted,
  isVideoOff,
  isFriendVideoOff,
  toggleMuted,
  toggleVideo,
  endCall,
  friendProfile,
}) => {
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
        <Box sx={{ mt: '10vh', display: isFriendVideoOff ? 'block' : 'none' }}>
          <Avatar
            src={friendProfile.profilePicture}
            alt={friendProfile.fullName}
            sx={{ height: 200, width: 200, mx: 'auto', mb: 2 }}
          />
          <Typography
            align="center"
            variant="h4"
            fontWeight="Bold"
            component="h1"
          >
            {friendProfile.fullName}
          </Typography>
        </Box>
        <Box
          component="video"
          ref={friendVideoElRef}
          autoPlay
          playsInline
          sx={{
            height: 1,
            width: 1,
            position: 'absolute',
            bgcolor: 'common.black',
            borderRadius: 3,
            display: isFriendVideoOff ? 'none' : 'block',
          }}
        />
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
              onClick={toggleVideo}
              size="large"
              color="primary"
            >
              {isVideoOff ? <VideocamOffTwoToneIcon /> : <VideocamTwoToneIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="End call">
            <IconButton
              onClick={endCall}
              sx={{ '&:focus': { boxShadow: 'none!important' } }}
              size="large"
              color="primary"
            >
              <CallEndTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 16, right: 16, display: isVideoOff ? 'none' : 'block' }}>
        <Box
          component="video"
          ref={userVideoElRef}
          autoPlay
          muted
          playsInline
          sx={{ height: 120, width: 160, borderRadius: 1, bgcolor: 'common.white', boxShadow: 3 }}
        />
      </Box>
    </Box>
  );
};
