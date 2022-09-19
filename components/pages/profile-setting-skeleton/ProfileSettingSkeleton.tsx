import { Box, Skeleton, Grid, InputLabel } from '@mui/material';
import type { FC } from 'react';
import { times } from '../../../util/callback';

export const ProfileSettingSkeleton: FC = () => {
  return (
    <Box>
      <Skeleton
        height="2.25rem"
        width={240}
        sx={{ mb: 4 }}
      />
      <Grid
        container
        spacing={2.5}
        sx={{ mb: 2.5 }}
      >
        {times(6, (_item, index) => (
          <Grid
            key={index}
            item
            xs={12}
            lg={6}
            xl={4}
          >
            <Skeleton
              variant="text"
              width={160}
              height={24}
              sx={{ mb: 0.5 }}
            />
            <Skeleton height={56} />
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          lg={6}
        >
          <Skeleton
            variant="text"
            width={160}
            height={24}
            sx={{ mb: 0.5 }}
          />
          <Skeleton height={148} />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <Skeleton
            variant="text"
            width={160}
            height={24}
            sx={{ mb: 0.5 }}
          />
          <Skeleton
            width={200}
            height="calc(1.4rem + 12px)"
          />
        </Grid>
      </Grid>
      <Skeleton
        width={200}
        height="calc(1.6rem + 24px)"
        variant="pill"
      />
    </Box>
  );
};
