import { z } from 'zod';

// TODO - the two groups separated by the dot must be valid base64 strings
export const tokenSchema = z.string().regex(/^(.+)\.(.+)$/);

export type Token = z.infer<typeof tokenSchema>;

export const headerSchema = z.object({
  usr: z.string().nonempty(),
  eat: z
    .string()
    .datetime({ offset: true })
    .nonempty()
    .transform((dateString) => new Date(dateString))
});

export type TokenHeader = z.infer<typeof headerSchema>;
