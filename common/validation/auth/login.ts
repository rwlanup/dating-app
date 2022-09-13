import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Please enter your email address',
      invalid_type_error: 'Please enter a valid email address',
    })
    .email('Please enter a valid email address'),
  password: z
    .string({
      required_error: 'Please enter a password',
      invalid_type_error: 'Please enter a valid password',
    })
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password cannot be longer than 20 characters'),
});

export type LoginInputs = z.infer<typeof loginSchema>;
