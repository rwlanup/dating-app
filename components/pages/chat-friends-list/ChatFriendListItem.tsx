import { ListItem, ListItemAvatar, Avatar, ListItemText, Badge, ListItemButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useStore } from '../../../hooks/useStore';
import { onlineUsersStore } from '../../../store/onlineUsersStore';
import { FriendWithFirstChat } from '../../../types/chat';

interface ChatFriendListItemProps {
  friend: FriendWithFirstChat;
}

export const ChatFriendListItem: FC<ChatFriendListItemProps> = ({ friend }) => {
  const { query } = useRouter();
  const isOnline = useStore(
    onlineUsersStore,
    (state) => state.members.has(friend.id),
    () => false
  );

  return (
    <ListItem
      key={friend.id}
      alignItems="flex-start"
      disablePadding
    >
      <Link
        passHref
        href={{ query: { id: friend.friendId } }}
        shallow
      >
        <ListItemButton
          selected={query.id === friend.friendId}
          sx={{ px: { xs: 2, xl: 3 }, py: 1 }}
        >
          <ListItemAvatar>
            <Badge
              variant="dot"
              overlap="circular"
              invisible={!isOnline}
            >
              <Avatar
                alt={friend.fullName}
                src={friend.profilePicture}
              />
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{ fontWeight: 'Medium' }}
            primary={friend.fullName}
            secondary={friend.chat?.message || `Say hi to ${friend.fullName}`}
            secondaryTypographyProps={
              friend.chat && !friend.chat.isRead ? { color: 'common.black', fontWeight: 'Medium' } : undefined
            }
          />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};
