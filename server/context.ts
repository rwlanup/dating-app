import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './prisma';
import { Session, unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../pages/api/auth/[...nextauth]';
import { pusher } from './pusher';

interface CreateContextOptions {
  session: Session | null;
  req: NextApiRequest;
  res: NextApiResponse;
  prisma: typeof prisma;
  pusher: typeof pusher;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(options: CreateContextOptions) {
  return options;
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext({ req, res }: trpcNext.CreateNextContextOptions): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching

  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  return await createContextInner({
    req,
    res,
    prisma,
    session,
    pusher,
  });
}
