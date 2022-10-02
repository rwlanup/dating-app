import type { FC } from 'react';
import { FRIENDS_TYPE } from '../../../pages/profile/friends';
import { ErrorScreen } from '../error-screen/ErrorScreen';
import { FriendsListItem } from './FriendsListItem';
import Diversity1TwoToneIcon from '@mui/icons-material/Diversity1TwoTone';
import { FriendOrRequest } from '../../../types/friend';

interface FriendsListProps {
  friends: FriendOrRequest[];
  type: FRIENDS_TYPE;
}

export const FriendsList: FC<FriendsListProps> = ({ friends, type }) => {
  const title: string =
    type === 'FRIENDS'
      ? 'Oops, you do not have any friends yet'
      : type === 'RECEIVED_REQUESTS'
      ? 'Oops, you have not received any friend request yet'
      : 'Oops, you have not sent any friend request yet';

  if (friends.length === 0) {
    return (
      <ErrorScreen
        icon={
          <Diversity1TwoToneIcon
            color="error"
            sx={{ height: 120, width: 120 }}
          />
        }
        HeadingProps={{ variant: 'h3' }}
        title={title}
        hideBtn
      />
    );
  }

  return (
    <>
      {friends.map((friend) => (
        <FriendsListItem
          key={friend.id}
          friend={friend}
          type={type}
        />
      ))}
    </>
  );
};
