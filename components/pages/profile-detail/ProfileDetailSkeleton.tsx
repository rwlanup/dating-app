import { Box, Grid, Skeleton, Typography } from '@mui/material';
import type { FC } from 'react';
import { times } from '../../../util/callback';
import { ProfileDetailInterestsSkeleton } from './ProfileDetailInterestsSkeleton';

export const ProfileDetailSkeleton: FC = () => {
  return (
    <>
      <Grid
        container
        spacing={2.5}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'center', sm: 'stretch' }}
      >
        <Grid item>
          <Skeleton
            variant="rounded"
            height={240}
            width={240}
            sx={{
              borderRadius: 3,
              bgcolor: 'primary.50',
            }}
          />
        </Grid>
        <Grid
          item
          xs
        >
          <Grid
            container
            direction="column"
            sx={{ maxWidth: '50rem', minHeight: 1, mt: 0 }}
            rowSpacing={2}
          >
            <Grid item>
              <Box>
                <Grid
                  container
                  spacing={2}
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography
                      color="secondary"
                      fontWeight="Medium"
                      sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: 0.5 }}
                    >
                      <Skeleton
                        width={160}
                        sx={{ mx: { xs: 'auto', sm: '0' } }}
                      />
                    </Typography>
                    <Typography
                      align="center"
                      variant="h3"
                      fontWeight="Regular"
                      width={240}
                      sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                    >
                      <Skeleton />
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    alignSelf={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Box sx={{ maxWidth: '25rem', mx: 'auto' }}>
                      <Skeleton
                        variant="pill"
                        width="100%"
                        height="calc(1.75rem + 16px)"
                        sx={{ minWidth: 240 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid
              item
              sx={{ mt: 'auto' }}
            >
              <Grid
                container
                spacing={1}
              >
                {times(4, (_item, index) => (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    lg={6}
                  >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Skeleton
                        height="1em"
                        width="1em"
                      />
                      <Typography>
                        <Skeleton width={160} />
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ProfileDetailInterestsSkeleton />
    </>
  );
};
