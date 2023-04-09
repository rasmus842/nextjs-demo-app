import Layout from '~/components/Layout';
import 'normalize.css';
import '~/pages/globals.css';
import type { AppProps } from 'next/app';
import { api } from '~/utils/api';

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default api.withTRPC(App);
