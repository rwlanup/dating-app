import { Box, Typography, TypographyProps } from '@mui/material';
import { Interest } from '@prisma/client';
import { FC } from 'react';
import { UserProfile } from '../../../types/profile';
import { groupInterestsByMatch } from '../../../util/server';
import { trpc } from '../../../util/trpc';
import { ProfileDetailInterestsSkeleton } from './ProfileDetailInterestsSkeleton';

interface ProfileInterestsListProps extends TypographyProps {
  label: string;
  interests?: Interest[];
}

const ProfileInterestsList: FC<ProfileInterestsListProps> = ({ label, interests, ...otherProps }) => {
  if (!interests || interests.length === 0) return null;
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ mb: 1 }}
        {...otherProps}
      >
        {label}
      </Typography>

      <Typography
        component="ol"
        sx={{ listStylePosition: 'inside' }}
      >
        {interests.map((interest, index) => (
          <Box
            component="li"
            key={interest.id}
            sx={{ mt: index === 0 ? 0 : 0.5 }}
          >
            <Typography component="span">{interest.name}</Typography>
          </Box>
        ))}
      </Typography>
    </Box>
  );
};

interface ProfileDetailInterestsProps {
  bio?: UserProfile['bio'];
  interests?: UserProfile['interests'];
}
export const ProfileDetailInterests: FC<ProfileDetailInterestsProps> = ({ bio, interests }) => {
  const { data, isLoading } = trpc.useQuery(['interests.mine']);
  if (!data || isLoading) return <ProfileDetailInterestsSkeleton />;

  if (!bio && (!interests || interests?.length === 0)) return null;

  const { matchingInterests, otherInterests } = groupInterestsByMatch(interests, data);

  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {bio && (
        <Box>
          <Typography
            variant="h4"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Bio
          </Typography>
          <Typography>{bio}</Typography>
        </Box>
      )}
      <ProfileInterestsList
        color="success.main"
        label="Matching interests"
        interests={matchingInterests}
      />
      <ProfileInterestsList
        color="secondary.main"
        label="Other interests"
        interests={otherInterests}
      />
    </Box>
  );
};
