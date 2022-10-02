import { Box, List, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useFriendsList } from '../../../hooks/useFriendsList';
import { SearchForm } from '../../others/search-form/SearchForm';
import { ChatFriendListItem } from './ChatFriendListItem';
import { ChatFriendsListSkeleton } from './ChatFriendsListSkeleton';

export const ChatFriendsList: FC = () => {
  const { friends, isLoading } = useFriendsList(false);
  const [search, setSearch] = useState('');
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    const _searchText = search.toLowerCase();
    return friends.filter((friend) => {
      return (
        friend.profile.fullName.toLowerCase().includes(_searchText) ||
        friend.profile.username.toLowerCase().includes(_searchText)
      );
    });
  }, [search, friends]);

  if (isLoading || !friends) return <ChatFriendsListSkeleton />;

  if (friends.length === 0) return <div>Empty list..</div>;

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
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 1 }}
        >
          Chat with your friends
        </Typography>
        <SearchForm
          submitOnChange
          onSubmit={setSearch}
          sx={{ mb: 0 }}
          TextFieldProps={{ placeholder: 'Search friends' }}
        />
      </Box>
      <List
        sx={{
          width: 1,
          py: 0,
          '.MuiListItem-root:not(:last-child)': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      >
        {filteredFriends.map((friend) => (
          <ChatFriendListItem
            key={friend.id}
            friend={friend}
          />
        ))}
      </List>
    </Box>
  );
};
