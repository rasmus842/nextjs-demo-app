// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/db/db';
import { todosTable } from '~/db/schema';
import { Todo } from '~/db/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      db.select()
        .from(todosTable)
        .then((todoList) => res.json(todoList));
    } else if (req.method === 'POST') {
      const newTodo = Todo.InsertSchema.parse(req.body);
      db.insert(todosTable)
        .values(newTodo)
        .then((result) => {
          res.status(201).json({
            id: result.insertId,
            ...newTodo
          });
        });
    }
  } catch (e) {
    res.status(500).end();
  }
}
