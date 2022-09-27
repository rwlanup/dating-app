import type { FC } from 'react';
import { FRIENDS_TYPE } from '../../../pages/profile/friends';
import { FriendWithProfile } from '../../../types/friend';
import { FriendsListItem } from './FriendsListItem';

interface FriendsListProps {
  friends: FriendWithProfile[];
  type: FRIENDS_TYPE;
}

export const FriendsList: FC<FriendsListProps> = ({ friends, type }) => {
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
