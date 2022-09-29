import { Avatar, Box, Grid, IconButton, Skeleton, Theme, Typography, useMediaQuery } from '@mui/material';
import { FC, useEffect } from 'react';
import { CHANNEL_NAMES } from '../../../../common/config/pusher';
import { toggleProfileDrawerOnMobileVisible } from '../../../../store/layoutUIStore';
import { addMember, removeMember, resetFromSubscription } from '../../../../store/onlineUsersStore';
import { pusher } from '../../../../util/pusher';
import { trpc } from '../../../../util/trpc';

export const HeaderAvatar: FC = () => {
  // Authenticating user
  useEffect(() => {
    pusher.user.signin();
  }, []);

  // Authorizing for presence channel
  useEffect(() => {
    const channel = pusher.subscribe(CHANNEL_NAMES.online);
    channel.bind('pusher:subscription_succeeded', resetFromSubscription);
    channel.bind('pusher:member_added', addMember);
    channel.bind('pusher:member_removed', removeMember);
    return () => {
      channel.unsubscribe();
    };
  }, []);

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
