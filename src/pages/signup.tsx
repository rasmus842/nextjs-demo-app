import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '~/utils/api';
import { useSession, useSessionUpdater } from '~/utils/use-session';

export const userSchema = z.object({
  name: z
    .string()
    .min(6)
    .max(256)
    .regex(/^[a-zA-Z0-9]+$/)
    .nonempty({ message: 'Username must be provided' }),
  password: z
    .string()
    .min(6)
    .max(256)
    .regex(/^[a-zA-Z0-9]+$/)
    .nonempty({ message: 'Password must be provided' })
});

type NewUser = z.infer<typeof userSchema>;

export default function SignupPage() {
  const session = useSession();
  const updateSession = useSessionUpdater();
  const signupMut = api.users.signup.useMutation();

  const f = useForm<NewUser>({
    resolver: zodResolver(userSchema)
  });

  const onSubmit: SubmitHandler<NewUser> = (data) => {
    console.log('submitted signup data:', data);
    signupMut.mutate(data);
  };

  useEffect(() => {
    if (signupMut.isSuccess) {
      console.log('Got token: ', signupMut.data);
      window.sessionStorage.setItem('token', signupMut.data);
      updateSession();
    }
  }, [signupMut.data, signupMut.isSuccess, updateSession]);

  return (
    <form className="" onSubmit={f.handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col justify-center align-middle">
        <div>
          <label htmlFor="userName">Username:</label>
          <input type="text" id="userName" {...f.register('name')} />
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input type="password" id="password" {...f.register('password')} />
        </div>
        <button className="bg-green-400" type="submit">
          Submit
        </button>
      </fieldset>
    </form>
  );
}
