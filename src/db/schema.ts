import { int, text, timestamp, varchar } from 'drizzle-orm/mysql-core/columns';
import { mysqlTable } from 'drizzle-orm/mysql-core/table';

// FOREIGN KEYS are not supported at planetscale-mysql, so they are not added in actuality!!!
// still writing reference-methods in-case using another db

export const usersTable = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: text('name').notNull(),
  passwordHash: varchar('password_hash', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const todosTable = mysqlTable('todos', {
  id: int('id').autoincrement().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  userId: int('user_id').references(() => usersTable.id)
});
