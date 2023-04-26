import { createHmac } from 'crypto';
import { env } from '~/env.mjs';
import { headerSchema, tokenSchema } from './token';

export interface Session {
  user?: string;
  expiresAt?: Date;
  isAuthorised: boolean;
}

export function getSession(token: string | null | undefined): Session {
  if (!token) return { isAuthorised: false };

  const parsedToken = tokenSchema.safeParse(token);
  if (!parsedToken.success) return { isAuthorised: false };
  const [headerStringBase64, signature] = parsedToken.data.split('.');

  const hash = createHmac('sha-256', env.SECRET)
    .update(headerStringBase64)
    .digest('base64');
  if (hash !== signature) return { isAuthorised: false };

  const headerString = Buffer.from(headerStringBase64, 'base64').toString(
    'utf-8'
  );
  const header = headerSchema.safeParse(JSON.parse(headerString));
  if (!header.success) return { isAuthorised: false };
  return {
    user: header.data.usr,
    expiresAt: header.data.eat,
    isAuthorised: header.data.eat.getTime() < new Date().getTime()
  };
}
