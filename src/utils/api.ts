import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../server/api/routers/_app';
import SuperJSON from 'superjson';
import { env } from '~/env.mjs';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  else return `${env.BASE_URL}`;
}

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: () => env.NEXT_PUBLIC_NODE_ENV === 'development'
        }),
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,

          // You can pass any HTTP headers you wish here
          headers() {
            return {
              authorization: window.sessionStorage.getItem('token') ?? ''
            };
          }
        })
      ]
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false
});
