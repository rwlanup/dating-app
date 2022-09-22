import { Box, Grid, alpha } from '@mui/material';
import type { FC } from 'react';
import { ProfileListItem as TProfileListItem } from '../../../types/profile';
import { ErrorScreen } from '../error-screen/ErrorScreen';
import { ProfileListItem } from '../profile-list-item/ProfileListItem';
import { ProfileListSkeleton } from './ProfileListSkeleton';
import SearchOffTwoToneIcon from '@mui/icons-material/SearchOffTwoTone';

interface ProfileListProps {
  profiles?: TProfileListItem[];
  isLoading?: boolean;
}

export const ProfileList: FC<ProfileListProps> = ({ profiles, isLoading }) => {
  if (isLoading || !profiles) {
    return <ProfileListSkeleton />;
  }

  if (profiles.length === 0) {
    return (
      <ErrorScreen
        icon={<SearchOffTwoToneIcon sx={{ height: 120, width: 120 }} />}
        title="Oops, no partners found"
        hideBtn
      />
    );
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
