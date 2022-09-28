import { Grid } from '@mui/material';
import type { FC } from 'react';
import { ChatMessageInfo } from './ChatMessageInfo';
import { ChatMessageListItem } from './ChatMessageListItem';

export const ChatMessageList: FC = () => {
  return (
    <Grid
      container
      direction="column"
      spacing={0.5}
      flexWrap="nowrap"
    >
      <Grid
        item
        xs
      >
        <ChatMessageListItem variant="RECEIVED" />
      </Grid>
      <Grid
        item
        xs
      >
        <ChatMessageInfo>You were in call with Sarah Conner</ChatMessageInfo>
      </Grid>
      <Grid
        item
        xs
      >
        <ChatMessageListItem variant="RECEIVED" />
      </Grid>
      <Grid
        item
        xs
      >
        <ChatMessageListItem variant="RECEIVED" />
      </Grid>
      <Grid
        item
        xs
      >
        <ChatMessageInfo>Today 24 September, 2022</ChatMessageInfo>
      </Grid>
      <Grid
        item
        xs
      >
        <ChatMessageListItem variant="SENT" />
      </Grid>
      <Grid
        item
        xs
      >
        <ChatMessageListItem variant="SENT" />
      </Grid>
    </Grid>
  );
};
