import { verify } from 'argon2';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '../../../common/validation/auth/login';
import { prisma } from '../../../server/prisma';

export const nextAuthOptions: NextAuthOptions = {
  pages: {
    signIn: '/?action=login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Eg: johndoe' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {
        const { username, password } = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { username },
        });

        if (!user) return null;

        const isMatchingPassword = await verify(user.password, password);

        if (isMatchingPassword) {
          return {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePicture: user.profilePicture,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.fullName = user.fullName;
        token.id = user.id;
        token.username = user.username;
        token.profilePicture = user.profilePicture;
      }

      return token;
    },

    session: async ({ session, token }) => {
      if (token) {
        session.user.username = token.username as string;
        session.user.fullName = token.fullName;
        session.user.id = token.id;
        session.user.profilePicture = token.profilePicture;
      }
      return session;
    },
  },
};

export default NextAuth(nextAuthOptions);
