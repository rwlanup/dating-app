import { Friends, User } from '@prisma/client';
import { UserProfile } from './profile';

export type FriendWithProfile = Friends & {
  profile: Omit<UserProfile, 'interests'>;
};

export type RawFriendWithProfile = FriendWithProfile & {
  requestedUser?: User;
  receiverUser?: User;
};
