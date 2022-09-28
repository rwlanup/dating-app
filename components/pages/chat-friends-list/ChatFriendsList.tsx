import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import type { FC } from 'react';
import { SearchForm } from '../../others/search-form/SearchForm';

export const ChatFriendsList: FC = () => {
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
          onSubmit={console.log}
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
        <ListItem
          alignItems="flex-start"
          sx={{ px: { xs: 2, xl: 3 }, py: 1 }}
        >
          <ListItemAvatar>
            <Avatar
              alt="Sarah Conner"
              src="https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
            />
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{ fontWeight: 'Medium' }}
            primary="Sarah Conner"
            secondary="Can we meet tonight in the Dancing"
          />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          sx={{ px: { xs: 2, xl: 3 }, py: 1 }}
        >
          <ListItemAvatar>
            <Avatar
              alt="Kiran Shahi"
              src="https://images.pexels.com/photos/460237/pexels-photo-460237.jpeg?h=350&auto=compress&cs=tinysrgb"
            />
          </ListItemAvatar>
          <ListItemText
            primary="Kiran Shahi"
            primaryTypographyProps={{ fontWeight: 'Medium' }}
            secondary="Please call me as soon as you get this message"
            secondaryTypographyProps={{ color: 'common.black', fontWeight: 'Medium' }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
