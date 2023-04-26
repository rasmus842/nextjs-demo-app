import Layout from '~/components/Layout';
import type { AppType } from 'next/app';
import { api } from '~/utils/api';
import 'normalize.css';
import '~/pages/globals.css';
import { env } from '~/env.mjs';
import { SessionProvider } from '~/utils/use-session';

const App: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <SessionProvider>
      <Layout isDev={env.NEXT_PUBLIC_NODE_ENV === 'development'}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
