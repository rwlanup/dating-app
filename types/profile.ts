import type { Interest, User } from '@prisma/client';
import { PaginatedResult } from './server';
import { OmitByKeys } from './utils';

export type ProfileListItem = OmitByKeys<
  User,
  'deletedAt' | 'password' | 'createdAt' | 'updatedAt' | 'profilePicture'
> & {
  address?: string | null;
  profilePicture: string;
};

export type PaginatedProfile = PaginatedResult<ProfileListItem>;

export type UserProfile = OmitByKeys<User, 'password' | 'profilePicture'> & {
  profilePicture?: string;
  address?: string | null;
  interests: Interest[];
};
