import {
  bigint,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core/columns';
import { mysqlTable } from 'drizzle-orm/mysql-core/table';

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'bigint' }).autoincrement().primaryKey(),
  name: text('name').notNull(),
  passwordHash: varchar('password_hash', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const todos = mysqlTable('todos', {
  id: bigint('id', { mode: 'bigint' }).autoincrement().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  userId: bigint('user_id', { mode: 'bigint' }).references(() => users.id)
});
