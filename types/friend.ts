import { Chats, Friends } from '@prisma/client';
import { UserProfile } from './profile';
import { OmitByKeys } from './utils';

export type FriendWithProfileAndFirstChat = Friends & {
  profile: OmitByKeys<UserProfile, 'interests' | 'bio' | 'lastChatReadAt' | 'updatedAt' | 'createdAt'>;
  chat?: Chats;
};

export type ApprovedFriendWithFirstChat = OmitByKeys<FriendWithProfileAndFirstChat, 'approvedAt'> & {
  approvedAt: Date;
};

export type FriendRequest = OmitByKeys<FriendWithProfileAndFirstChat, 'chat' | 'approvedAt'>;

export type FriendOrRequest = OmitByKeys<FriendWithProfileAndFirstChat, 'chat' | 'approvedAt'> & {
  approvedAt?: Date | null;
};
