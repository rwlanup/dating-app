import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
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
});
