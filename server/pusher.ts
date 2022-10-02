/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import Pusher from 'pusher';
import { env } from './env';

const pusherGlobal = global as typeof global & {
  pusher?: Pusher;
};

export const pusher: Pusher =
  pusherGlobal.pusher ||
  new Pusher({
    appId: env.PUSHER_APP_ID,
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    key: env.NEXT_PUBLIC_PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    useTLS: true,
  });

pusherGlobal.pusher = pusher;
