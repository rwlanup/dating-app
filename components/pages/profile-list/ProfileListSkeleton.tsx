import { alpha, Box, Grid } from '@mui/material';
import { FC } from 'react';
import { times } from '../../../util/callback';
import { ProfileListItemSkeleton } from '../profile-list-item/ProfileListItemSkeleton';

export const ProfileListSkeleton: FC = () => {
  return (
    <Grid
      container
      spacing={4}
    >
      {times(2, (_item, index) => (
        <Grid
          item
          flex="0 1 auto"
          key={index}
        >
          <Box
            sx={(theme) =>
              index !== 2
                ? {
                    pb: 4,
                    borderBottom: 1,
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }
                : {}
            }
          >
            <ProfileListItemSkeleton />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
