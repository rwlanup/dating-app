import { ListItem, ListItemAvatar, Avatar, ListItemText, Badge, ListItemButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useStore } from '../../../hooks/useStore';
import { onlineUsersStore } from '../../../store/onlineUsersStore';
import { ApprovedFriendWithFirstChat } from '../../../types/friend';

interface ChatFriendListItemProps {
  friend: ApprovedFriendWithFirstChat;
}

export const ChatFriendListItem: FC<ChatFriendListItemProps> = ({ friend }) => {
  const { data: session } = useSession();
  const { query } = useRouter();
  const isOnline = useStore(
    onlineUsersStore,
    (state) => state.members.has(friend.profile.id),
    () => false
  );

  return (
    <ListItem
      alignItems="flex-start"
      disablePadding
    >
      <Link
        passHref
        href={{ query: { id: friend.id } }}
        shallow
      >
        <ListItemButton
          selected={query.id === friend.id}
          sx={{ px: { xs: 2, xl: 3 }, py: 1 }}
        >
          <ListItemAvatar>
            <Badge
              variant="dot"
              overlap="circular"
              invisible={!isOnline}
            >
              <Avatar
                alt={friend.profile.fullName}
                src={friend.profile.profilePicture}
              />
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{ fontWeight: 'Medium' }}
            primary={friend.profile.fullName}
            secondary={friend.chat?.message || `Say hi to ${friend.profile.fullName}`}
            secondaryTypographyProps={
              friend.chat && !friend.chat.isRead && friend.chat.senderId !== session?.user.id
                ? { color: 'common.black', fontWeight: 'Medium' }
                : undefined
            }
          />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};
