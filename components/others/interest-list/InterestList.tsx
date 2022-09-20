import { Box, BoxProps, Typography } from '@mui/material';
import type { Interest } from '@prisma/client';
import type { FC } from 'react';

interface InterestListProps extends BoxProps {
  interests?: Interest[];
  label: string;
}

export const InterestList: FC<InterestListProps> = ({ interests, label, ...otherProps }) => {
  if (!interests || interests.length === 0) return null;

  return (
    <Box {...otherProps}>
      <Typography color="text.secondary">{label}</Typography>
      <Box
        component="ol"
        sx={{ listStylePosition: 'inside' }}
      >
        {interests.map((interest) => (
          <Typography
            component="li"
            key={interest.id}
            sx={{ mb: 1 }}
          >
            {interest.name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
