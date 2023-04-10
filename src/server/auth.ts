import { GetServerSidePropsContext } from 'next';
import { DefaultSession, NextAuthOptions, getServerSession } from 'next-auth';

/**
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  /*
  interface User {
    role: UserRole
    ...etc
  }
  */
}

/**
 * Options for configuring adapters, callbacks, providers, etc
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {},
  providers: [
    /**
     * Can also add other providers - github, discord, OAuth, email etc
     * @see https://next-auth.js.org/providers
     */
  ]
};

// Wrapper fn so that don't have to add authOptions everywhere
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
