import Layout from '~/components/Layout';
import type { AppType } from 'next/app';
import { api } from '~/utils/api';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import 'normalize.css';
import '~/pages/globals.css';

const App: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
