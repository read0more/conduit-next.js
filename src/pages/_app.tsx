import type { AppProps } from 'next/app';
import { trpc } from 'src/lib/client/trpc';
import '@csstools/normalize.css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(App);
