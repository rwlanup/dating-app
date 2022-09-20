import * as z from 'zod';

export const updateInterestsSchema = z.object({
  interests: z
    .array(
      z
        .string({
          required_error: 'Please enter your interest',
        })
        .trim()
        .min(2, 'Interest name must be at least 2 characters long')
        .max(50, 'Interest name cannot be longer than 50 characters'),
      {
        required_error: 'Please enter your interests',
        invalid_type_error: 'Please enter a valid interests',
      }
    )
    .min(5, 'Please add at least 5 interests')
    .max(20, 'You cannot add more than 20 interests'),
});

export type InterestInputs = z.infer<typeof updateInterestsSchema>;
