import { Box, Grid, Skeleton } from '@mui/material';
import type { FC } from 'react';
import { times } from '../../../util/callback';

export const ProfileListItemSkeleton: FC = () => {
  return (
    <Box>
      <Grid
        container
        alignItems="center"
        justifyContent={{ xs: 'center', sm: 'flex-start' }}
        spacing={2.5}
        sx={{ flexWrap: { sm: 'nowrap' } }}
      >
        <Grid item>
          <Skeleton
            variant="rounded"
            height={200}
            width={200}
          />
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            rowSpacing={2}
          >
            {/* Username and names */}
            <Grid item>
              <Skeleton
                variant="text"
                sx={{ mb: 0.5, mx: { xs: 'auto', sm: 0 } }}
                height={24}
                width={160}
              />
              <Skeleton
                variant="text"
                height={28}
                width={200}
                sx={{ mx: { xs: 'auto', sm: 0 } }}
              />
            </Grid>

            <Grid item>
              {times(2, (_item, index) => (
                <Skeleton
                  key={index}
                  variant="text"
                  sx={{ mb: index === 0 ? 0.5 : 0, mx: { xs: 'auto', sm: 0 } }}
                  height={24}
                  width={280}
                />
              ))}
            </Grid>

            <Grid item>
              <Grid
                container
                spacing={2}
              >
                {times(2, (_item, index) => (
                  <Grid
                    item
                    xs
                    key={index}
                  >
                    <Skeleton
                      variant="pill"
                      height={44}
                      width={160}
                      sx={{ mx: { xs: 'auto', sm: 0 } }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
