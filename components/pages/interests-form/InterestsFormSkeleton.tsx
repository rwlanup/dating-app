import { Box, Skeleton } from '@mui/material';
import type { FC } from 'react';

export const InterestsFormSkeleton: FC = () => {
  return (
    <Box>
      <Skeleton
        height="2.25rem"
        width={240}
        sx={{ mb: 4 }}
      />
      <Skeleton
        variant="rectangular"
        height={56}
        sx={{ mb: 2.5 }}
      />
      <Skeleton
        width={200}
        height="calc(1.6rem + 24px)"
        variant="pill"
      />
    </Box>
  );
};
