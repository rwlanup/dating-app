import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authenticatePresenceSchema } from '../../../common/validation/pusher/auth';
import { pusher } from '../../../server/pusher';
import { nextAuthOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = authenticatePresenceSchema.safeParse(req.body);
  if (body.success) {
    const { socket_id, channel_name } = body.data;
    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (session) {
      const auth = pusher.authorizeChannel(socket_id, channel_name, {
        user_id: session.user.id,
      });

      res.send(auth);
      return;
    }
  }
  res.status(400).send('LOL');
}
