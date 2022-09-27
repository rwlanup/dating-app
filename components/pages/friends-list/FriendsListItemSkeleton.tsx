import { alpha, Box, Skeleton, Typography } from '@mui/material';
import type { FC } from 'react';
import { times } from '../../../util/callback';

export const FriendsListItemSkeleton: FC = () => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: { md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 2,
        p: 2,
        flexWrap: 'wrap',
        bgcolor: alpha(theme.palette.primary[50], 0.5),
        borderRadius: 2,
        flexDirection: { xs: 'column', md: 'row' },
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 'auto',
          textDecoration: 'none',
          color: 'common.black',
          flexWrap: 'wrap',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row', md: 'column', lg: 'row' },
        }}
      >
        <Box sx={{ minWidth: { md: 'calc(50% - 16px)' }, display: 'flex' }}>
          <Skeleton
            variant="circular"
            height={56}
            width={56}
          />
          <Box sx={{ ml: 2, my: 0.75 }}>
            <Typography
              variant="h4"
              sx={{ mb: 0.5 }}
            >
              <Skeleton sx={{ minWidth: 180 }}>
                <span className="hidden"></span>
              </Skeleton>
            </Typography>
            <Typography
              variant="content"
              sx={{ mb: 0.5 }}
            >
              <Skeleton sx={{ minWidth: 100 }}>
                <span className="hidden"></span>
              </Skeleton>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ minWidth: { md: 'calc(50% - 16px)' }, mt: 0.75 }}>
          {times(2, (_item, index) => (
            <Typography
              key={index}
              sx={{ mb: 0.5 }}
            >
              <Skeleton sx={{ minWidth: 180 }}>
                <span className="hidden"></span>
              </Skeleton>
            </Typography>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: 'auto',
          justifyContent: 'flex-end',
          alignSelf: { xs: 'stretch', md: 'flex-end' },
          pb: 0.75,
        }}
      >
        <Skeleton
          variant="pill"
          height="calc(1.42rem + 12px)"
          sx={{ width: { xs: '100%', sm: 100 } }}
        />
      </Box>
    </Box>
  );
};
