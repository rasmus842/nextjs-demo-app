import Modal from '~/components/Modal';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
  title: String;
  text?: String;
};

export default function TodoPage() {
  const [isModalActive, setIsModalActive] = useState(false);
  const [todoList, setTodoList] = useState<TodoProps[]>([]);

  const f = useForm<FormValues>();

  const addTodo: SubmitHandler<FormValues> = (data) => {
    // TODO - add the todo and update state
  };

  const removeTodo = (id: number) => {
    // TODO - remove the todo and update state
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
              <Todo
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
              <input type="text" id="description" {...f.register('text')} />
            </div>
            <button type="submit">Add</button>
          </fieldset>
        </form>
      </Modal>
    </>
  );
}

type TodoProps = {
  id: number;
  title: string;
  description?: string;
  removeTodo: (id: number) => void;
};

const Todo = ({ id, title, description, removeTodo }: TodoProps) => {
  return (
    <div className="relative w-[300px] min-h-[200px] flex flex-col p-3 bg-amber-200 border-black border-2 rounded">
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
