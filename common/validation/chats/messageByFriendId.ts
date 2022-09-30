import * as z from 'zod';
export const messageByFriendIdSchema = z.object({
  friendId: z.string({ required_error: 'Please provide a friend id' }),
  cursor: z
    .string({
      invalid_type_error: 'Please provide a valid cursor',
    })
    .optional(),
});

export type MessageByFriendIdInputs = z.infer<typeof messageByFriendIdSchema>;
