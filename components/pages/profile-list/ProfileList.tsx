import { Box, Grid, alpha } from '@mui/material';
import type { FC } from 'react';
import { ProfileListItem as TProfileListItem } from '../../../types/profile';
import { ProfileListItem } from '../profile-list-item/ProfileListItem';
import { ProfileListSkeleton } from './ProfileListSkeleton';

interface ProfileListProps {
  profiles?: TProfileListItem[];
  isLoading?: boolean;
}

export const ProfileList: FC<ProfileListProps> = ({ profiles, isLoading }) => {
  if (isLoading || !profiles) {
    return <ProfileListSkeleton />;
  }

  return (
    <Grid
      container
      spacing={4}
    >
      {profiles.map((profile, index) => (
        <Grid
          item
          flex="0 1 auto"
          key={profile.id}
        >
          <Box
            sx={(theme) =>
              index !== profiles.length - 1
                ? {
                    pb: 4,
                    borderBottom: 1,
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }
                : {}
            }
          >
            {}
            <ProfileListItem data={profile} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
