import { createHmac } from 'crypto';
import { z } from 'zod';
import { env } from '~/env.mjs';

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

export const createToken = (userName: string): Token => {
  // TODO - create token
  // with the form <header>.<signature>
  // header - { usr: username, eat: expiresAt}
  // signature = hmac hash with some hashing algo and secret, base64 input and output

  const header: TokenHeader = {
    usr: userName,
    eat: new Date()
  };

  const headerBase64 = Buffer.from(JSON.stringify(header), 'utf8').toString(
    'base64'
  );

  const signature = createHmac('sha-256', env.SECRET)
    .update(headerBase64)
    .digest('base64');

  return `${headerBase64}.${signature}`;
};
