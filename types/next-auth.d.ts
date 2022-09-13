import type NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';

interface _User {
  id: string;
  slug: string;
  fullName: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

declare module 'next-auth' {
  interface User extends _User {}

  interface Session {
    user: Omit<_User, 'gender'>;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends Omit<_User, 'gender'> {}
}
