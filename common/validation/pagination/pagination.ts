import * as z from 'zod';

export const paginationSchema = z
  .object({
    page: z
      .number({
        invalid_type_error: 'Page must be a number',
      })
      .optional()
      .nullable(),
    search: z
      .string({
        invalid_type_error: 'Please provide a valid search text',
      })
      .optional()
      .nullable(),
  })
  .optional()
  .nullable();
