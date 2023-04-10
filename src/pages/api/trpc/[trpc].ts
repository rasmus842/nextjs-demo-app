import { createNextApiHandler } from '@trpc/server/adapters/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTRPCContext } from '~/server/api/context';
import { appRouter } from '~/server/api/routers/_app';
import { env } from '~/env.mjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return nextApiHandler(req, res);
}

// @see https://nextjs.org/docs/api-routes/introduction
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
          );
        }
      : undefined
});
