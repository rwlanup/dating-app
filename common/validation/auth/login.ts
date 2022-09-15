import * as z from 'zod';

export const loginSchema = z.object({
  username: z
    .string({
      required_error: 'Please enter your email address',
      invalid_type_error: 'Please enter a valid email address',
    })
    .trim()
    .min(5, 'Username must be at least 5 characters long')
    .max(20, 'Username cannot be longer than 20 characters')
    .refine((value) => value.indexOf(' ') === -1, 'Username cannot contain spaces'),
  password: z
    .string({
      required_error: 'Please enter a password',
      invalid_type_error: 'Please enter a valid password',
    })
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password cannot be longer than 20 characters'),
});

export type LoginInputs = z.infer<typeof loginSchema>;
