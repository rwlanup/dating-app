import { Chats, User } from '@prisma/client';
import { OmitByKeys } from './utils';

export type FriendWithFirstChat = OmitByKeys<
  User,
  | 'bio'
  | 'city'
  | 'country'
  | 'createdAt'
  | 'dob'
  | 'gender'
  | 'lastChatReadAt'
  | 'password'
  | 'profilePicture'
  | 'updatedAt'
> & {
  profilePicture?: string;
  chat?: Chats;
  approvedAt: Date;
  friendId: string;
};
