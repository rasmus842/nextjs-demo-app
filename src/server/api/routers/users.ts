import { createTRPCRouter, publicProcedure } from '../init';
import { db } from '~/db/db';
import { usersTable } from '~/db/schema';
import { User } from '~/db/types';
import { createToken, tokenSchema } from '~/server/auth/token';
import { z } from 'zod';
import { createHash, randomBytes } from 'crypto';
import { userSchema } from '~/pages/signup';

export const usersRouter = createTRPCRouter({
  signup: publicProcedure
    .input(userSchema)
    .output(tokenSchema)
    .mutation(async (req) => {
      const passwordHash = hash(req.input.password);

      const newUser: User.Insert = {
        name: req.input.name,
        passwordHash: `${passwordHash.hash}:${passwordHash.salt}`
      };
      /*
      const result = await db.insert(usersTable).values(newUser);
      */
      const name = req.input.name;
      console.log('New user signed up:', name);
      return createToken(name);
    }),
  login: publicProcedure
    .input(userSchema)
    .output(tokenSchema)
    .query(async (req) => {
      /*
      Assert login credentials match those in db.
      If valid - token, if not, then send error message
      */
      const name = req.input.name;
      const password = req.input.password;
      console.log('User logged in: ', name);
      return createToken(name);
    })
});

interface PasswordHash {
  hash: string;
  salt: string;
}

const hash = (password: string): PasswordHash => {
  const salt = randomBytes(4).toString('utf-8');
  const pepper = randomBytes(1).toString('utf-8');
  const hash = createHash('sha256')
    .update(password + salt + pepper)
    .digest('base64');
  return {
    hash,
    salt
  };
};
