import Modal from '~/components/Modal';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { db } from '~/db/db';
import { todosTable } from '~/db/schema';
import { Todo } from '~/db/types';
import { zodResolver } from '@hookform/resolvers/zod';

export default function TodoPage({
  todos
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isModalActive, setIsModalActive] = useState(false);
  const [todoList, setTodoList] = useState(todos);

  const f = useForm<Todo.Insert>({
    resolver: zodResolver(Todo.InsertSchema)
  });

  const addTodo: SubmitHandler<Todo.Insert> = async (newTodo) => {
    try {
      const result = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });
      const addedTodo = Todo.SelectSchema.parse(await result.json());
      setTodoList((prev) => [...prev, addedTodo]);
      setIsModalActive(false);
    } catch (err) {
      console.error('addTodo error: ', err);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      const result = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      if (result.status !== 204) {
        console.error(result);
      } else {
        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="min-h-full flex flex-col">
        <button
          className="self-center my-5 bg-gray-500 w-[100px] border-2 rounded border-black"
          onClick={() => setIsModalActive(true)}
        >
          Add new Todo
        </button>
        <div className="flex-auto p-5 flex flex-row flex-wrap gap-5">
          {todoList.map((todo, index) => {
            console.log(todo);
            return (
              <Card
                key={todo.id}
                id={todo.id}
                title={todo.title}
                description={todo.description}
                removeTodo={removeTodo}
              />
            );
          })}
        </div>
      </div>
      <Modal
        isOpen={isModalActive}
        title="Add new todo-item"
        onCancel={() => setIsModalActive(false)}
      >
        <form onSubmit={f.handleSubmit(addTodo)}>
          <fieldset>
            <div>
              <label htmlFor="title">title:</label>
              <input type="text" id="title" {...f.register('title')} />
            </div>
            <div>
              <label htmlFor="text">description:</label>
              <input
                type="text"
                id="description"
                {...f.register('description')}
              />
            </div>
            <button type="submit">Add</button>
          </fieldset>
        </form>
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  todos: Todo.Type[];
}> = async () => {
  const todos = await db.select().from(todosTable);
  return {
    props: {
      todos
    }
  };
};

type CardProps = {
  id: number;
  title: string;
  description: string | null;
  removeTodo: (id: number) => void;
};

const Card = ({ id, title, description, removeTodo }: CardProps) => {
  return (
    <div className="relative w-[300px] min-h-[200px] flex flex-col p-3 bg-amber-800 border-black border-2 rounded">
      <h2 className="mb-2 capitalize underline">{title}</h2>
      <p>{description}</p>
      <button
        className="absolute bottom-2 right-2"
        onClick={() => removeTodo(id)}
      >
        Remove
      </button>
    </div>
  );
};
