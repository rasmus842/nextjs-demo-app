import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '~/utils/api';
import { useSession, useSessionUpdater } from '~/utils/use-session';
import { userSchema } from './signup';

type OldUser = z.infer<typeof userSchema>;

export default function SignupPage() {
  const session = useSession();
  const updateSession = useSessionUpdater();
  const router = useRouter();
  const loginMut = api.users.login.useMutation();

  const f = useForm<OldUser>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      password: ''
    },
    resolver: zodResolver(userSchema)
  });

  useEffect(() => {
    if (session.isAuthorised) {
      // TODO - redirect to a different page. Already logged in or smth like that.
      router.replace('/');
    }
  }, [session, router]);

  useEffect(() => {
    if (loginMut.isSuccess && !session.isAuthorised) {
      console.log('Got token: ', loginMut.data);
      window.sessionStorage.setItem('token', loginMut.data);
      updateSession();
    }
  }, [loginMut.isSuccess, loginMut.data, session, updateSession]);

  const onSubmit: SubmitHandler<OldUser> = (data) => {
    console.log('submitted login data:', data);
    loginMut.mutate(data);
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
