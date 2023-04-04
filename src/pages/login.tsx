import { SubmitHandler, useForm } from 'react-hook-form';

type LoginFormValues = {
  userName: String;
  password: String;
};

export default function LoginPage() {
  const f = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    // TODO
  };

  return (
    <form onSubmit={f.handleSubmit(onSubmit)}>
      <fieldset>
        <div>
          <label htmlFor="userName">Username:</label>
          <input type="text" id="userName" {...f.register('userName')} />
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input type="password" id="password" {...f.register('password')} />
        </div>
        <button type="submit">Add</button>
      </fieldset>
    </form>
  );
}
