import { createHmac } from 'crypto';
import { env } from '~/env.mjs';
import { Token, TokenHeader } from './token-schema';

export const TOKEN_TIME_MILLIS = env.TOKEN_TIME_HOURS * 60 * 60 * 1000;

export const createToken = (userName: string): Token => {
  // TODO - create token
  // with the form <header>.<signature>
  // header - { usr: username, eat: expiresAt}
  // signature = hmac hash with some hashing algo and secret, base64 input and output
  const expiresAt = Date.now() + TOKEN_TIME_MILLIS;

  const header: TokenHeader = {
    usr: userName,
    eat: new Date(expiresAt)
  };

  const headerBase64 = Buffer.from(JSON.stringify(header), 'utf8').toString(
    'base64'
  );

  const signature = createHmac('sha-256', env.SECRET)
    .update(headerBase64)
    .digest('base64');

  return `${headerBase64}.${signature}`;
};
