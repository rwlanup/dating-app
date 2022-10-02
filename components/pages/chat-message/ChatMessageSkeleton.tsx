import { Box, Skeleton } from '@mui/material';
import type { FC } from 'react';

export const ChatMessageSkeleton: FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        maxHeight: 1,
        overflowY: 'auto',
      }}
    >
      <Box
        component="section"
        sx={{
          position: 'relative',
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, xl: 3 },
            pt: { xs: 2, xl: 3 },
            pb: 2,
            position: 'sticky',
            top: 0,
            left: 0,
            bgcolor: 'common.white',
          }}
          component="header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton
              variant="circular"
              height={40}
              width={40}
            />
            <Box>
              <Skeleton
                width={100}
                height="1.5rem"
                sx={{ mb: 0.125 }}
              />
              <Skeleton
                width={50}
                height="1.25rem"
              />
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Skeleton
                variant="circular"
                height={40}
                width={40}
              />
              <Skeleton
                variant="circular"
                height={40}
                width={40}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
