import { Avatar, Box, Grid, IconButton, Skeleton, Theme, Typography, useMediaQuery } from '@mui/material';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { FC, useContext, useEffect } from 'react';
import { CHANNEL_NAMES } from '../../../../common/config/pusher';
import { PusherContext } from '../../../../context/pusher';
import { useFriendsList } from '../../../../hooks/useFriendsList';
import { toggleProfileDrawerOnMobileVisible } from '../../../../store/layoutUIStore';
import { addMember, removeMember, resetFromSubscription } from '../../../../store/onlineUsersStore';
import { trpc } from '../../../../util/trpc';

export const HeaderAvatar: FC = () => {
  const pusher = useContext(PusherContext);

  // Authenticating user
  useEffect(() => {
    if (pusher) {
      if (!pusher.user.signin_requested) {
        pusher.user.signin();
      }
    }
  }, [pusher]);

  // Authorizing for pusher channels channel
  useEffect(() => {
    if (pusher && !pusher.channel(CHANNEL_NAMES.online)) {
      const presenceChannel = pusher.subscribe(CHANNEL_NAMES.online);
      presenceChannel.bind('pusher:subscription_succeeded', resetFromSubscription);
      presenceChannel.bind('pusher:member_added', addMember);
      presenceChannel.bind('pusher:member_removed', removeMember);
      return () => {
        presenceChannel.unsubscribe();
      };
    }
  }, [pusher]);

  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const { isLoading, data, isIdle } = trpc.useQuery(['profile.me'], {
    ssr: false,
    refetchOnWindowFocus: false,
    onError: () => {
      signOut();
    },
  });

  useFriendsList(true);

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
    <Link
      passHref
      href="/profile"
    >
      <Grid
        component="a"
        sx={{ textDecoration: 'none', color: 'common.black' }}
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
    </Link>
  );
};

export default HeaderAvatar;
