import * as z from 'zod';
import { loginSchema } from './login';

export const registerSchema = loginSchema
  .extend({
    fullName: z
      .string({
        required_error: 'Please enter your full name',
        invalid_type_error: 'Please enter a valid full name',
      })
      .trim()
      .min(3, 'Full name must be at least 3 characters long')
      .max(150, 'Full name cannot be longer than 150 characters'),
    confirmPassword: z.string({
      required_error: 'Please re-type your password',
      invalid_type_error: 'Please re-type your password',
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInputs = z.infer<typeof registerSchema>;
