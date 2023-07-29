import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '~/utils/api';
import { useSession, useSessionUpdater } from '~/utils/use-session';

export const userSchema = z.object({
  name: z
    .string()
    .min(6, 'Username must be at least 6 characters long!')
    .max(256, 'Username is too long!')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only letters and numbers!')
    .nonempty({ message: 'Username must be provided' }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long!')
    .max(256, 'Password is too long!')
    .regex(/^[a-zA-Z0-9]+$/, 'Password must contain only letters and numbers!')
    .nonempty({ message: 'Password must be provided' })
});

type NewUser = z.infer<typeof userSchema>;

export default function SignupPage() {
  const session = useSession();
  const updateSession = useSessionUpdater();
  const router = useRouter();
  const signupMut = api.users.signup.useMutation();

  const f = useForm<NewUser>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      password: ''
    },
    resolver: zodResolver(userSchema)
  });

  useEffect(() => {
    if (session.isAuthorised) {
      router.replace('/');
    }
  }, [session, router]);

  useEffect(() => {
    if (signupMut.isSuccess && !session.isAuthorised) {
      console.log('Got token: ', signupMut.data);
      window.sessionStorage.setItem('token', signupMut.data);
      updateSession();
    }
  }, [signupMut.isSuccess, signupMut.data, session, updateSession]);

  const onSubmit: SubmitHandler<NewUser> = (data) => {
    console.log('submitted signup data:', data);
    signupMut.mutate(data);
  };

  return (
    <form className="" onSubmit={f.handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col justify-center align-middle">
        <div>
          <label htmlFor="userName">Username:</label>
          <input
            className="bg-slate-500"
            type="text"
            id="userName"
            {...f.register('name')}
          />
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input
            className="bg-slate-500"
            type="password"
            id="password"
            {...f.register('password')}
          />
        </div>
        <button className="bg-green-400" type="submit">
          Submit
        </button>
      </fieldset>
    </form>
  );
}
