import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { createTRPCContext } from './context';
import SuperJSON from 'superjson';

/**
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

/**
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * @see https://trpc.io/docs/server/middlewares
 */
const authMiddleware = t.middleware(({ ctx, next }) => {
  return next({
    ctx: {}
  });
});

/**
 * @see https://trpc.io/docs/procedures
 */
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(authMiddleware);
