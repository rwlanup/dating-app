import { Box, Skeleton } from '@mui/material';
import type { FC } from 'react';

export const ChatFriendListItemSkeleton: FC = () => {
  return (
    <Box sx={{ px: { xs: 2, xl: 3 }, py: 1.75, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Skeleton
        variant="circular"
        height={40}
        width={40}
      />
      <Box>
        <Skeleton
          width={200}
          height="1.5rem"
          sx={{ mb: 0.125 }}
        />
        <Skeleton
          width={300}
          height="1.25rem"
        />
      </Box>
    </Box>
  );
};
