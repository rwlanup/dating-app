import * as z from 'zod';

export const RESPOND_FRIEND_VALUES = ['ACCEPT', 'DENY'] as const;
export const respondFriendSchema = z.object({
  id: z.string({
    required_error: 'Please provide a friend request id',
  }),
  response: z.enum(RESPOND_FRIEND_VALUES, {
    required_error: 'Please provide a response type',
  }),
});

export type RespondFriendInput = z.infer<typeof respondFriendSchema>;
