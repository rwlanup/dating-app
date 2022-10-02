import { Box, Tab, Typography } from '@mui/material';
import type { NextPage } from 'next';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { SyntheticEvent, useState } from 'react';
import { useFriendsList } from '../../hooks/useFriendsList';
import { FriendsList } from '../../components/pages/friends-list/FriendsList';
import { ErrorScreen } from '../../components/pages/error-screen/ErrorScreen';
import { FriendsPageSkeleton } from '../../components/pages/friends-page-skeleton/FriendsPageSkeleton';
import { FriendOrRequest } from '../../types/friend';

export type FRIENDS_TYPE = 'FRIENDS' | 'SENT_REQUESTS' | 'RECEIVED_REQUESTS';

const TABS: { label: string; value: FRIENDS_TYPE }[] = [
  { label: 'Friends', value: 'FRIENDS' },
  { label: 'Received Requests', value: 'RECEIVED_REQUESTS' },
  { label: 'Sent Requests', value: 'SENT_REQUESTS' },
];

const FriendsPage: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<FRIENDS_TYPE>('FRIENDS');
  const { isLoading, isError, errorMessage, friends, receivedFriendRequests, sentFriendRequests } = useFriendsList();
  if (isError) {
    return (
      <ErrorScreen
        title="500 server error"
        message={errorMessage}
      />
    );
  }

  if (isLoading) return <FriendsPageSkeleton />;

  const handleChange = (_event: SyntheticEvent, newValue: FRIENDS_TYPE) => {
    setCurrentTab(newValue);
  };

  const getFriendsByTab = (tabValue: FRIENDS_TYPE): FriendOrRequest[] => {
    switch (tabValue) {
      case 'FRIENDS':
        return friends || [];
      case 'RECEIVED_REQUESTS':
        return receivedFriendRequests || [];
      case 'SENT_REQUESTS':
        return sentFriendRequests || [];
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        component="h1"
        sx={{ mb: 4 }}
      >
        Your friends and requests
      </Typography>
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'primary.light' }}>
          <TabList
            variant="scrollable"
            onChange={handleChange}
            aria-label="Friends tabs"
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.label}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </TabList>
        </Box>
        {TABS.map((tab) => (
          <TabPanel
            sx={{ p: 0, pt: 2 }}
            key={tab.label}
            value={tab.value}
          >
            <FriendsList
              friends={getFriendsByTab(tab.value)}
              type={tab.value}
            />
          </TabPanel>
        ))}
      </TabContext>
    </>
  );
};

export default FriendsPage;
