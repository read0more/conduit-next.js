import type { AppProps } from 'next/app';
import { trpc } from 'src/lib/client/trpc';
import UserProvider from 'src/lib/client/UserProvider';
import '@csstools/normalize.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default trpc.withTRPC(App);
