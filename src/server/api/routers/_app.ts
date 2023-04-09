import { createTRPCRouter } from '../context';
import { todosRouter } from './todos';

export const appRouter = createTRPCRouter({
  todos: todosRouter
});

export type AppRouter = typeof appRouter;
