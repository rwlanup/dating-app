import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const nextAuthOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email address', type: 'text', placeholder: 'myname@example.com' },
        password: { label: 'Password', type: 'password', placeholder: 'Your password' },
      },
      async authorize(credentials, req) {
        return { email: credentials?.email, password: credentials?.password };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.fullName = user.fullName;
        token.id = user.id;
        token.email = user.email;
        token.slug = user.slug;
      }

      return token;
    },

    session: async ({ session, token }) => {
      if (token) {
        session.user.email = token.email as string;
        session.user.fullName = token.fullName;
        session.user.id = token.id;
        session.user.slug = token.slug;
      }
      return session;
    },
  },
};

export default NextAuth(nextAuthOptions);
