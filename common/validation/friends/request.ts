import * as z from 'zod';

export const friendRequestSchema = z.string({ required_error: 'Please provider user id to send the request' });

export type FriendRequestInput = z.infer<typeof friendRequestSchema>;

export const friendIdSchema = z.string({ required_error: 'Please provide a friend id' });
