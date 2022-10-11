import {
  Avatar,
  Box,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import type { FC } from 'react';
import { ApprovedFriendWithFirstChat } from '../../../types/friend';
import { CallButton } from '../../others/call-button/CallButton';
import { useStore } from '../../../hooks/useStore';
import { onlineUsersStore } from '../../../store/onlineUsersStore';
import { PrivateChatButton } from '../../others/private-chat-button/PrivateChatButton';

interface ChatMessageHeaderProps {
  friendProfile: ApprovedFriendWithFirstChat['profile'];
  id: string;
}

export const ChatMessageHeader: FC<ChatMessageHeaderProps> = ({ friendProfile, id }) => {
  const isOnline = useStore(
    onlineUsersStore,
    (state) => state.members.has(friendProfile.id),
    () => false
  );

  return (
    <Box
      sx={{
        px: { xs: 2, xl: 3 },
        pt: { xs: 2, xl: 3 },
        pb: 2,
        position: 'sticky',
        top: 0,
        left: 0,
        bgcolor: 'common.white',
        zIndex: 10,
      }}
      component="header"
    >
      <ListItem
        disablePadding
        component="div"
      >
        <ListItemAvatar>
          <Avatar
            alt={friendProfile.fullName}
            src={friendProfile.profilePicture}
          />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ fontWeight: 'Medium' }}
          primary={friendProfile.fullName}
          secondary={friendProfile.profession}
          secondaryTypographyProps={{ color: 'secondary' }}
        />
        {isOnline && (
          <Grid
            container
            sx={{ width: 'auto' }}
            columnSpacing={1}
          >
            <Grid item>
              <PrivateChatButton friendId={id} />
            </Grid>
            <Grid item>
              <CallButton id={id} />
            </Grid>
          </Grid>
        )}
      </ListItem>
    </Box>
  );
};
