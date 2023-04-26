import { createTRPCRouter } from '../init';
import { todosRouter } from './todos';
import { usersRouter } from './users';

export const appRouter = createTRPCRouter({
  todos: todosRouter,
  users: usersRouter
});

export type AppRouter = typeof appRouter;
