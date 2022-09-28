import { Box, Grid, IconButton, TextField } from '@mui/material';
import type { FC } from 'react';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';

export const ChatMessageBox: FC = () => {
  return (
    <Box
      sx={{
        px: { xs: 2, xl: 3 },
        py: 2,
        position: 'sticky',
        bottom: 0,
        left: 0,
        bgcolor: 'common.white',
        mt: 'auto',
      }}
    >
      <Grid
        container
        columnSpacing={1}
        component="form"
        alignItems="flex-end"
        flexWrap="nowrap"
      >
        <Grid
          item
          xs
        >
          <TextField
            InputProps={{ sx: { fontSize: '0.875rem' } }}
            placeholder="Your message..."
            multiline
          />
        </Grid>
        <Grid item>
          <IconButton
            type="submit"
            color="primary"
            size="large"
          >
            <SendTwoToneIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};
