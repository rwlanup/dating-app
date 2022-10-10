import * as z from 'zod';

export const callRespondSchema = z.object({
  id: z.string({ required_error: 'Please provide a valid chat id' }),
  response: z.enum(['ANSWER', 'REJECT']),
});
