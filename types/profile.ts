import type { User } from '@prisma/client';
import { OmitByKeys } from './utils';

export type ProfileListItem = OmitByKeys<
  User,
  'deletedAt' | 'password' | 'createdAt' | 'updatedAt' | 'profilePicture'
> & {
  address?: string | null;
  profilePicture: string;
};
