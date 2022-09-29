import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authenticateUserSchema } from '../../../common/validation/pusher/auth';
import { pusher } from '../../../server/pusher';
import { nextAuthOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = authenticateUserSchema.safeParse(req.body);
  if (body.success) {
    const { socket_id } = body.data;
    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (session) {
      const auth = pusher.authenticateUser(socket_id, {
        id: session.user.id,
      });

      res.send(auth);
      return;
    }
  }
  res.status(400).send('LOL');
}
