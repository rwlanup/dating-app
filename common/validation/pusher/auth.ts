import * as z from 'zod';

export const authenticatePresenceSchema = z.object({
  channel_name: z.string(),
  socket_id: z.string(),
});

export const authenticateUserSchema = z.object({
  socket_id: z.string(),
});
