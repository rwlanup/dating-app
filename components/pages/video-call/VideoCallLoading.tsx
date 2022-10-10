import { Box, Button, Skeleton, Typography } from '@mui/material';
import type { FC } from 'react';
import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';

interface VideoCallLoadingProps {
  isCaller?: boolean;
  onCallEnd?: () => void;
  name?: string;
}
export const VideoCallLoading: FC<VideoCallLoadingProps> = ({ isCaller, onCallEnd, name = 'friend' }) => {
  return (
    <Box sx={{ height: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Skeleton
        width={200}
        height={200}
        variant="circular"
      />
      <Skeleton
        sx={{ my: 2 }}
        width={160}
        height="1.875rem"
      />
      <Typography
        variant="h4"
        fontWeight="Bold"
      >
        Connecting to {name}...
      </Typography>
      {isCaller && onCallEnd && (
        <Button
          onClick={onCallEnd}
          endIcon={<CallEndTwoToneIcon />}
          sx={{ mt: 3 }}
          color="error"
        >
          End call
        </Button>
      )}
    </Box>
  );
};
