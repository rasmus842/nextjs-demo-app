import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { todosTable, usersTable } from './schema';

// Use drizzle-orm, drizzle-zod and zod to generate any type corresponding to database object
// InferModel to get plain type
// createInsertSchema to alter type with zod

export const IdSchema = z.string().regex(/^\d+$/).transform(Number);

export namespace Todo {
  export const SelectSchema = createSelectSchema(todosTable);
  export type Type = z.infer<typeof SelectSchema>;
  export const InsertSchema = createInsertSchema(todosTable).omit({ id: true });
  export type Insert = z.infer<typeof InsertSchema>;
  export const UpdateSchema = createInsertSchema(todosTable, {
    title: z.string().optional()
  }).omit({ id: true });
  export type Update = z.infer<typeof UpdateSchema>;
}

export namespace User {
  export const SelectSchema = createInsertSchema(usersTable);
  export type Type = z.infer<typeof SelectSchema>;

  export const InsertSchema = createInsertSchema(usersTable).omit({ id: true });
  export type Insert = z.infer<typeof InsertSchema>;
}
