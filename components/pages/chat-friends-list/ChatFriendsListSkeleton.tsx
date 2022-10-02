import { Box, Skeleton } from '@mui/material';
import type { FC } from 'react';
import { times } from '../../../util/callback';
import { ChatFriendListItemSkeleton } from './ChatFriendListItemSkeleton';

export const ChatFriendsListSkeleton: FC = () => {
  return (
    <Box
      component="aside"
      sx={{ position: 'relative' }}
    >
      <Box
        sx={{
          bgcolor: 'primary.50',
          zIndex: 10,
          px: { xs: 2, xl: 3 },
          pt: { xs: 2, xl: 3 },
          pb: 2,
          position: 'sticky',
          top: 0,
          left: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Skeleton
          height="1.75rem"
          width={240}
          sx={{ mb: 1 }}
        />
        <Skeleton height="calc(1.5rem + 24px)" />
      </Box>
      <Box
        sx={{
          '& > .MuiBox-root:not(:last-child)': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      >
        {times(2, (_item, index) => (
          <ChatFriendListItemSkeleton key={index} />
        ))}
      </Box>
    </Box>
  );
};
