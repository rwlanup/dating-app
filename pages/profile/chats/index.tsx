import { Box, Grid, Theme, useMediaQuery } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ErrorScreen } from '../../../components/pages/error-screen/ErrorScreen';
import { useFriendsList } from '../../../hooks/useFriendsList';
import Diversity1TwoToneIcon from '@mui/icons-material/Diversity1TwoTone';
import { trpc } from '../../../util/trpc';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const DynamicChatMessage = dynamic(() => import('../../../components/pages/chat-message/ChatMessage'));
const DynamicChatFriendsList = dynamic(() => import('../../../components/pages/chat-friends-list/ChatFriendsList'));

const ChatsPage: NextPage = () => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const { query } = useRouter();
  const hasFriendId = typeof query.id === 'string';
  const { isError, errorMessage, friends, isSuccess } = useFriendsList();
  const { mutate } = trpc.useMutation('profile.updateLastChatRead');

  useEffect(() => {
    if (isSuccess) {
      mutate();
    }
  }, [isSuccess, mutate]);

  if (isError) {
    return (
      <ErrorScreen
        title="500 server error"
        message={errorMessage}
      />
    );
  }

  if (friends && friends.length === 0) {
    return (
      <ErrorScreen
        icon={
          <Diversity1TwoToneIcon
            color="error"
            sx={{ height: 120, width: 120 }}
          />
        }
        HeadingProps={{ variant: 'h3' }}
        title="Oops, you do not have any friends yet"
        hideBtn
      />
    );
  }

  return (
    <>
      <Head>
        <title>Chats | Ditto</title>
        <meta
          name="description"
          content="Chat with your dates and your friends. You can also join in private messages."
        />
      </Head>
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
          {!(!isDesktop && hasFriendId) && (
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
                <DynamicChatFriendsList />
              </Box>
            </Grid>
          )}
          {(isDesktop || hasFriendId) && (
            <Grid
              item
              xs={12}
              lg={8}
              sx={{ position: 'relative' }}
            >
              <DynamicChatMessage />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default ChatsPage;
