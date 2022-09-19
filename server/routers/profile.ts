import { Gender, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { profileSettingSchema } from '../../common/validation/profile/setting';
import { DataWithSuccessMessage } from '../../types/server';
import { OnlyRequiredByKeys } from '../../types/utils';
import { decryptBase64URL, resolveBase64ImageUrl } from '../../util/string';
import { createRouter } from '../createRouter';

export const profileRouter = createRouter()
  .mutation('update', {
    input: profileSettingSchema,
    resolve: async ({ input, ctx: { prisma, session } }): Promise<DataWithSuccessMessage> => {
      if (!session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not logged in, please log in to update your profile.',
        });
      }

      const decryptedProfilePictureData = decryptBase64URL(input.profilePicture as string);

      await prisma.user.update({
        where: {
          id: session.user.id,
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
      if (!session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not logged in, please log in to your account',
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
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
  });
