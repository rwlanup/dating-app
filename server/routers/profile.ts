import { Gender, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { Session } from 'next-auth';
import { profileByUsernameSchema } from '../../common/validation/profile/byUsername';
import { profileSettingSchema } from '../../common/validation/profile/setting';
import { authMiddleware } from '../../middleware/auth';
import { UserProfile } from '../../types/profile';
import { DataWithSuccessMessage } from '../../types/server';
import { OnlyRequiredByKeys } from '../../types/utils';
import { decryptBase64URL, resolveBase64ImageUrl } from '../../util/string';
import { createRouter } from '../createRouter';

export const profileRouter = createRouter()
  .middleware(authMiddleware)
  .mutation('update', {
    input: profileSettingSchema,
    resolve: async ({ input, ctx: { prisma, session } }): Promise<DataWithSuccessMessage> => {
      const _session = session as Session;
      const decryptedProfilePictureData = decryptBase64URL(input.profilePicture as string);

      await prisma.user.update({
        where: {
          id: _session.user.id,
        },
        select: {
          id: true,
        },
        data: {
          ...input,
          gender: input.gender as Gender,
          profilePictureMime: decryptedProfilePictureData?.mimeType || null,
          profilePicture: decryptedProfilePictureData?.data
            ? Buffer.from(decryptedProfilePictureData.data, 'base64')
            : null,
        },
      });

      return {
        message: 'Your profile has been updated successfully.',
        status: 200,
      };
    },
  })

  .query('me', {
    resolve: async ({
      ctx: { prisma, session },
    }): Promise<
      Omit<OnlyRequiredByKeys<User, 'id' | 'username' | 'fullName'>, 'profilePicture'> & {
        profilePicture?: string;
      }
    > => {
      const _session = session as Session;
      const user = await prisma.user.findUnique({
        where: {
          id: _session.user.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Your account could not be found. Please create an account.',
        });
      }

      const responseUser = user as OnlyRequiredByKeys<User, 'id' | 'username' | 'fullName'>;
      return {
        ...responseUser,
        profilePicture: resolveBase64ImageUrl(responseUser.profilePictureMime, responseUser.profilePicture),
      };
    },
  })

  .query('byUsername', {
    input: profileByUsernameSchema,
    resolve: async ({ ctx: { prisma }, input: username }): Promise<UserProfile> => {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          interests: {
            include: {
              interest: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User profile not found for a given username, maybe a profile has been deleted',
        });
      }

      delete (user as Partial<User>).password;

      return {
        ...user,
        profilePicture: resolveBase64ImageUrl(user.profilePictureMime, user.profilePicture),
        address: user.country && user.city && `${user.city}, ${user.country}`,
        interests: user.interests.map((interest) => {
          return interest.interest;
        }),
      };
    },
  });
