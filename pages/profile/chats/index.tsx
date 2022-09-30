import { Box, Grid, Theme, useMediaQuery } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChatFriendsList } from '../../../components/pages/chat-friends-list/ChatFriendsList';
import { ChatMessage } from '../../../components/pages/chat-message/ChatMessage';

const ChatsPage: NextPage = () => {
  const { query } = useRouter();
  const friendId = typeof query.id === 'string' ? query.id : undefined;
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <Box
      sx={{
        height: {
          xs: 'calc(100% + 32px)',
          md: 'calc(100% + 48px)',
        },
        overflow: 'hidden',
        m: { xs: -2, md: -3 },
      }}
    >
      <Grid
        container
        sx={{ height: 1 }}
      >
        {!(!isDesktop && friendId) && (
          <Grid
            item
            xs={12}
            lg={4}
            sx={{ position: 'relative' }}
          >
            <Box
              sx={{
                position: { lg: 'absolute' },
                left: 0,
                top: 0,
                bottom: 0,
                width: 1,
                maxHeight: 1,
                overflowY: 'scroll',
                borderRight: { lg: 2 },
                borderColor: { lg: 'divider' },
                bgcolor: 'primary.50',
              }}
            >
              <ChatFriendsList />
            </Box>
          </Grid>
        )}
        {(isDesktop || friendId) && (
          <Grid
            item
            xs={12}
            lg={8}
            sx={{ position: 'relative' }}
          >
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
              <ChatMessage />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ChatsPage;
