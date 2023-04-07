import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from 'drizzle-orm';
import { db } from '~/db/db';
import { todosTable } from '~/db/schema';
import { IdSchema, Todo } from '~/db/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const todoId = IdSchema.parse(id);
    switch (req.method) {
      case 'GET':
        get(res, todoId);
        break;
      case 'PUT':
        const updatedTodo = Todo.UpdateSchema.parse(req.body);
        put(res, todoId, updatedTodo);
        break;
      case 'DELETE':
        del(res, todoId);
        break;
    }
  } catch (e) {
    res.status(500).end();
  }
}

const get = (res: NextApiResponse, id: number) => {
  db.select()
    .from(todosTable)
    .where(sql`id = ${id}`)
    .then((todo) => {
      console.log(`Fetched todo: ${todo}`);
      if (todo.length === 0) {
        res.status(404).end();
      } else if (todo.length === 1) {
        res.json(todo);
      } else {
        res.status(500).end();
      }
    });
};

const put = (res: NextApiResponse, id: number, updatedTodo: Todo.Update) => {
  db.update(todosTable)
    .set({
      title: updatedTodo.title,
      description: updatedTodo.description,
      userId: updatedTodo.userId
    })
    .where(sql`id = ${id}`)
    .then((result) => {
      console.log(result);
      if (result.rowsAffected === 0) {
        res.status(404).end();
      } else {
        res.json(result);
      }
    });
};

const del = (res: NextApiResponse, id: number) => {
  db.delete(todosTable)
    .where(sql`id = ${id}`)
    .then((result) => {
      console.log(result);
      if (result.rowsAffected === 0) {
        res.status(404).end();
      } else {
        res.status(204).end();
      }
    });
};
