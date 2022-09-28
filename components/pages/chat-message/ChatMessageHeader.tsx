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

export const ChatMessageHeader: FC = () => {
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
            alt="Sarah Conner"
            src="https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
          />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ fontWeight: 'Medium' }}
          primary="Sarah Conner"
          secondary="Fashion Designer"
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
