import * as z from 'zod';

export const profileByUsernameSchema = z.string({
  required_error: 'Please provide a username for a profile',
});

export type ProfileByUsernameInput = z.infer<typeof profileByUsernameSchema>;
