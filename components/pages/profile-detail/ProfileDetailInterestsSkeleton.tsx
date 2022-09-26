import { Box, Skeleton } from '@mui/material';
import type { FC } from 'react';
import { times } from '../../../util/callback';

const InterestsListSkeleton: FC = () => {
  return (
    <Box>
      <Skeleton
        width={160}
        height="1.875rem"
        sx={{ mb: 1 }}
      />
      {times(3, (_item, index) => (
        <Skeleton
          width={240}
          key={index}
          sx={{ mt: index === 0 ? 0 : 0.5 }}
          height="1.5rem"
        />
      ))}
    </Box>
  );
};

export const ProfileDetailInterestsSkeleton: FC = () => {
  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Skeleton
          width={50}
          height="1.875rem"
          sx={{ mb: 1 }}
        />
        <Skeleton
          width={320}
          height="1.5rem"
        />
      </Box>
      <InterestsListSkeleton />
      <InterestsListSkeleton />
    </Box>
  );
};
