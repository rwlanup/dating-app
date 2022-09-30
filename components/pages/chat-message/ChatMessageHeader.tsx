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
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import type { FC } from 'react';
import { FriendWithFirstChat } from '../../../types/chat';

interface ChatMessageHeaderProps {
  friendInfo: Pick<FriendWithFirstChat, 'id' | 'fullName' | 'profession' | 'profilePicture'>;
}

export const ChatMessageHeader: FC<ChatMessageHeaderProps> = ({ friendInfo }) => {
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
      }}
      component="header"
    >
      <ListItem
        disablePadding
        component="div"
      >
        <ListItemAvatar>
          <Avatar
            alt={friendInfo.fullName}
            src={friendInfo.profilePicture}
          />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ fontWeight: 'Medium' }}
          primary={friendInfo.fullName}
          secondary={friendInfo.profession}
          secondaryTypographyProps={{ color: 'secondary' }}
        />
        <Grid
          container
          sx={{ width: 'auto' }}
          columnSpacing={1}
        >
          <Grid item>
            <Tooltip
              title={
                <Typography
                  color="inherit"
                  fontSize="inherit"
                  fontWeight="inherit"
                >
                  Private mode
                  <br />
                  Your messages won&apos;t be recorded
                </Typography>
              }
            >
              <IconButton size="large">
                <VisibilityOffTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Call now">
              <IconButton
                color="primary"
                size="large"
              >
                <CallTwoToneIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </ListItem>
    </Box>
  );
};
