import { db } from '~/db/db';
import { createTRPCRouter, publicProcedure } from '../context';
import { todosTable } from '~/db/schema';
import { IdSchema, Todo } from '~/db/types';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

export const todosRouter = createTRPCRouter({
  getAll: publicProcedure.query(async (req) => {
    const todos = await db.select().from(todosTable);
    return todos;
  }),
  add: publicProcedure.input(Todo.InsertSchema).mutation(async (req) => {
    const result = await db.insert(todosTable).values({ ...req.input });
    const id = IdSchema.parse(result.insertId);
    return id;
  }),
  remove: publicProcedure.input(z.number().int()).mutation(async (req) => {
    const result = await db.delete(todosTable).where(sql`id = ${req.input}`);
  })
});
