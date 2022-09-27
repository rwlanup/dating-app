import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import type { FC, ReactNode } from 'react';
import { FRIENDS_TYPE } from '../../../pages/profile/friends';
import { FriendWithProfile } from '../../../types/friend';
import { getFormattedDate, getYearsBetweenDate } from '../../../util/date';
import { trpc } from '../../../util/trpc';
import { FriendRequestButton } from '../../others/friend-request-button/FriendRequestButton';

interface FriendsListItemProps {
  friend: FriendWithProfile;
  type: FRIENDS_TYPE;
}
export const FriendsListItem: FC<FriendsListItemProps> = ({ friend: { profile, id }, type }) => {
  const utils = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: respondToRequest, isLoading: respondingToRequest } = trpc.useMutation('friends.respond-request', {
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onSuccess(data, { response }) {
      enqueueSnackbar(data.message, { variant: 'success' });
      utils.invalidateQueries(['friends.list-received-requests']);

      if (response === 'ACCEPT') {
        utils.invalidateQueries(['friends.list']);
      }
    },
  });

  const denyRequest = (): void => {
    respondToRequest({ id, response: 'DENY' });
  };
  const acceptRequest = (): void => {
    respondToRequest({ id, response: 'ACCEPT' });
  };

  const renderActions = (): ReactNode => {
    switch (type) {
      case 'FRIENDS':
        return (
          <FriendRequestButton
            size="small"
            friendId={profile.id}
            sx={{ maxWidth: { sm: '15rem' } }}
          />
        );
      case 'RECEIVED_REQUESTS':
        return (
          <>
            <LoadingButton
              fullWidth
              variant="outlined"
              loading={respondingToRequest}
              size="small"
              onClick={denyRequest}
              sx={{ maxWidth: { sm: '10rem' } }}
            >
              Deny
            </LoadingButton>
            <LoadingButton
              fullWidth
              size="small"
              loading={respondingToRequest}
              onClick={acceptRequest}
              sx={{ maxWidth: { sm: '10rem' } }}
            >
              Accept
            </LoadingButton>
          </>
        );
      case 'SENT_REQUESTS':
        return (
          <FriendRequestButton
            size="small"
            friendId={profile.id}
            sx={{ maxWidth: { sm: '15rem' } }}
          />
        );
    }
  };

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
      <Link
        passHref
        href={`/profile/${profile.username}`}
      >
        <Box
          component="a"
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
          <ListItem
            component="div"
            sx={{ minWidth: { md: 'calc(50% - 16px)' }, width: 'auto', p: 0, flex: 'auto' }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{ height: 56, width: 56 }}
                alt={profile.fullName}
                src={profile.profilePicture}
              />
            </ListItemAvatar>
            <ListItemText
              sx={{ ml: 2 }}
              primary={
                <Typography
                  component="h3"
                  variant="h4"
                  sx={{ mb: 0.5 }}
                >
                  {profile.fullName}
                </Typography>
              }
              secondary={
                <Typography
                  component="span"
                  color="secondary.main"
                  variant="content"
                >
                  {profile.profession}
                </Typography>
              }
            />
          </ListItem>
          {profile.address && profile.dob && (
            <ListItem
              component="div"
              sx={{ minWidth: { md: 'calc(50% - 16px)' }, width: 'auto', p: 0, flex: 'auto' }}
            >
              <ListItemText
                primary={<Typography fontWeight="Medium">From: {profile.address}</Typography>}
                secondary={
                  <Typography color="text.secondary">
                    Age: {getYearsBetweenDate(profile.dob)} ({getFormattedDate(profile.dob)})
                  </Typography>
                }
              />
            </ListItem>
          )}
        </Box>
      </Link>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flex: { xs: 'auto', sm: '0' },
          justifyContent: 'flex-end',
          alignSelf: { xs: 'stretch', md: 'flex-end' },
          pb: 0.75,
        }}
      >
        {renderActions()}
      </Box>
    </Box>
  );
};
