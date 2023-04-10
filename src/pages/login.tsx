import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginSchema = z.object({
  userName: z.string().nonempty(),
  password: z
    .string()
    .min(6)
    .max(256)
    .regex(/^[a-zA-Z0-9_\-].$/)
    .nonempty()
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const f = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema)
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    // TODO
  };

  return (
    <form onSubmit={f.handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col justify-center align-middle">
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
