import Layout from '~/components/Layout';
import type { AppType } from 'next/app';
import { api } from '~/utils/api';
import 'normalize.css';
import '~/pages/globals.css';
import { env } from '~/env.mjs';

const App: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <Layout isDev={env.NEXT_PUBLIC_NODE_ENV === 'development'}>
      <Component {...pageProps} />
    </Layout>
  );
};

export default api.withTRPC(App);
