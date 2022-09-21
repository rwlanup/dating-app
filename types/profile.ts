import type { User } from '@prisma/client';
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
