import { test, expect } from 'vitest';
import {
  TOKEN_TIME_MILLIS,
  TokenHeader,
  createToken
} from '~/server/auth/token';

const base64_regex =
  /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/;

test('Tests create token function in server/auth/token.ts', () => {
  const test_user = 'cypress';
  const now = Date.now();

  const token = createToken(test_user);
  expect(token).to.match(/(.+)\.(.+)/);

  const [headerBase64, signatureBase64] = token.split('.');
  expect(headerBase64).to.match(base64_regex);
  expect(signatureBase64).to.match(base64_regex);

  const headerString = Buffer.from(headerBase64, 'base64').toString('utf8');
  const header: TokenHeader = JSON.parse(headerString);
  expect(header.usr).to.eq(test_user);
  const eat = new Date(header.eat).getTime();
  expect(eat).to.be.toBeGreaterThanOrEqual(now + TOKEN_TIME_MILLIS);
});
