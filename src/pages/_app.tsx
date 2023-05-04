import 'src/styles/globals.css';
import type { AppProps } from 'next/app';
import { trpc } from 'src/lib/client/trpc';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(App);
