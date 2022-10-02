/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { authRouter } from './auth';
import { ZodError } from 'zod';
import { profileRouter } from './profile';
import { interestsRouter } from './interests';
import { friendsRouter } from './friends';
import { isPrismaError } from '../../util/prisma';
import { chatsRouter } from './chats';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', authRouter)
  .merge('profile.', profileRouter)
  .merge('interests.', interestsRouter)
  .merge('friends.', friendsRouter)
  .merge('chats.', chatsRouter)
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      message: isPrismaError(error.cause) ? 'Something went wrong, please try again later😟' : shape.message,
      zodError: error.code === 'BAD_REQUEST' && error.cause instanceof ZodError ? error.cause.flatten() : null,
    };
  });

export type AppRouter = typeof appRouter;
