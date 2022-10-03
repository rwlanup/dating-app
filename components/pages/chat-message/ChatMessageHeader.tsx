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

interface ChatMessageHeaderProps {
  friendProfile: ApprovedFriendWithFirstChat['profile'];
  id: string;
}

export const ChatMessageHeader: FC<ChatMessageHeaderProps> = ({ friendProfile, id }) => {
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
            <CallButton id={id} />
          </Grid>
        </Grid>
      </ListItem>
    </Box>
  );
};
