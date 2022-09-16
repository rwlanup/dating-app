import type NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';

interface _User {
  id: string;
  fullName: string;
  username: string;
}

declare module 'next-auth' {
  interface User extends _User {}

  interface Session {
    user: _User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends _User {}
}
