import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const nextAuthOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
  },
  providers: [
    CredentialsProvider({
      id: 'app_credential_provider',
      type: 'credentials',
      name: 'Email',
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
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },

    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(nextAuthOptions);
