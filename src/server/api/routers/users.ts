import { createTRPCRouter, publicProcedure } from '../init';
import { db } from '~/db/db';
import { usersTable } from '~/db/schema';
import { User } from '~/db/types';
import { createToken } from '~/server/auth/token';
import { tokenSchema } from '~/server/auth/token-schema';
import { createHash, randomBytes } from 'crypto';
import { userSchema } from '~/pages/signup';
import { sql } from 'drizzle-orm';
import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';

export const usersRouter = createTRPCRouter({
  signup: publicProcedure
    .input(userSchema)
    .output(tokenSchema)
    .mutation(async (req) => {
      const passwordBytes = Buffer.from(req.input.password);
      const salt = randomBytes(4);
      const pepper = randomBytes(1);
      const passwordHash = getPasswordHash(passwordBytes, salt, pepper);

      const newUser: User.Insert = {
        name: req.input.name,
        passwordHash: `${passwordHash}:${salt.toString('base64')}`
      };
      const result = await db.insert(usersTable).values(newUser);
      const name = req.input.name;
      console.log('New user signed up:', name);
      return createToken(name);
    }),
  login: publicProcedure
    .input(userSchema)
    .output(tokenSchema)
    .mutation(async (req) => {
      const name = req.input.name;
      const password = req.input.password;

      const result: User.Type[] = await db
        .select()
        .from(usersTable)
        .where(sql`name = ${name}`);

      if (result.length === 0) {
        throw new TRPCClientError(`User ${name} not found!`);
      } else if (result.length > 1) {
        throw new TRPCError({
          message: `More than one user with name ${name} found!`,
          code: 'INTERNAL_SERVER_ERROR'
        });
      }

      const user: User.Type = result[0];
      const isVerified = verifyPassword(user.passwordHash, password);
      if (!isVerified) {
        throw new TRPCClientError('Entered password is incorrect!');
      }

      console.log('User logged in: ', name);
      return createToken(name);
    })
});

const getPasswordHash = (
  password: Buffer,
  salt: Buffer,
  pepper: Buffer
): string => {
  return createHash('sha256')
    .update(Buffer.concat([password, salt, pepper]))
    .digest('base64');
};

const createPeppers = (): Buffer[] => {
  const byteArray: Buffer[] = [];
  for (let i = 0; i < 256; i++) {
    byteArray[i] = Buffer.of(i);
  }
  return byteArray;
};

const POSSIBLE_PEPPERS = createPeppers();

const verifyPassword = (passwordHash: string, password: string): boolean => {
  const passwordBytes = Buffer.from(password, 'utf-8');
  const [savedPassword, savedSalt] = passwordHash.split(':');
  const savedSaltBytes = Buffer.from(savedSalt, 'base64');
  return POSSIBLE_PEPPERS.some((pepper) => {
    const hash = getPasswordHash(passwordBytes, savedSaltBytes, pepper);
    return hash === savedPassword;
  });
};
