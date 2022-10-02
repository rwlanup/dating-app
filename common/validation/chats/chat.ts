import { ChatType } from '@prisma/client';
import * as z from 'zod';
export const chatSchema = z
  .object({
    friendId: z.string({ required_error: 'Please provide a friend id' }),
    type: z.enum([ChatType.CALL, ChatType.MESSAGE]),
    message: z.string().optional(),
  })
  .refine(({ type, message }) => type === 'MESSAGE' && message?.trim().length !== 0, {
    message: 'Please provide a message',
    path: ['message'],
  });
