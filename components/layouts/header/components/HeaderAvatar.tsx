import { Avatar, Box, Grid, IconButton, Skeleton, Theme, Typography, useMediaQuery } from '@mui/material';
import type { FC } from 'react';
import { toggleProfileDrawerOnMobileVisible } from '../../../../store/layoutUIStore';
import { trpc } from '../../../../util/trpc';

export const HeaderAvatar: FC = () => {
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const { isLoading, data, isIdle } = trpc.useQuery(['profile.me'], {
    ssr: false,
    refetchOnWindowFocus: false,
  });

  if (isIdle || isLoading || !data) {
    return (
      <Skeleton
        variant="circular"
        height={40}
        width={40}
      />
    );
  }

  if (isTablet) {
    return (
      <Box>
        <IconButton
          onClick={toggleProfileDrawerOnMobileVisible}
          aria-label="Open profile menu"
        >
          <Avatar
            alt={data.fullName}
            src={data.profilePicture}
          ></Avatar>
        </IconButton>
      </Box>
    );
  }

  return (
    <Grid
      container
      columnSpacing={1}
      alignItems="center"
    >
      <Grid item>
        <Typography
          variant="content"
          fontWeight="Bold"
        >
          👋 {data.fullName}
        </Typography>
      </Grid>
      <Grid item>
        <Avatar
          src={data.profilePicture}
          alt={data.fullName}
        ></Avatar>
      </Grid>
    </Grid>
  );
};
