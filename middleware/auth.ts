import { TRPCError } from '@trpc/server';
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';
import { Session } from 'next-auth';
import { Context } from '../server/context';

export const checkAuth = (session: Session | null): void | never => {
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not logged in, please log in to update your profile.',
    });
  }
};

export const authMiddleware: MiddlewareFunction<Context, Context, {}> = ({ ctx, next }) => {
  checkAuth(ctx.session);
  return next();
};
