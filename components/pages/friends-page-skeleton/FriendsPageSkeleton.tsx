import { Box, Skeleton, Typography } from '@mui/material';
import type { FC } from 'react';
import { times } from '../../../util/callback';
import { FriendsListItemSkeleton } from '../friends-list/FriendsListItemSkeleton';

export const FriendsPageSkeleton: FC = () => {
  return (
    <>
      <Typography
        variant="h3"
        sx={{ mb: 4 }}
      >
        <Skeleton sx={{ maxWidth: 320 }}>
          <span className="hidden"></span>
        </Skeleton>
      </Typography>
      <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
        {times(3, (_item, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={100}
            height="calc(1.75rem + 16px)"
            sx={{ mr: 1, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
          />
        ))}
      </Box>
      <Box sx={{ pt: 2 }}>
        <FriendsListItemSkeleton />
      </Box>
    </>
  );
};
