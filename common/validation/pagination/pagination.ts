import * as z from 'zod';

export const paginationSchema = z.object({
  cursor: z
    .string({
      invalid_type_error: 'Please provide a valid cursor',
    })
    .optional(),
  search: z
    .string({
      invalid_type_error: 'Please provide a valid search text',
    })
    .optional()
    .nullable(),
});

export type PaginationInputs = z.infer<typeof paginationSchema>;

export type RequiredPaginationInputs = Required<{
  [K in keyof Exclude<PaginationInputs, null | undefined>]: Exclude<
    Exclude<PaginationInputs, null | undefined>[K],
    null
  >;
}>;
