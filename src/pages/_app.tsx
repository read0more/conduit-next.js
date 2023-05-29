import type { AppProps } from 'next/app';
import { trpc } from 'src/lib/client/trpc';
import UserProvider from 'src/lib/client/UserProvider';
import '@csstools/normalize.css';
import { store } from '../store';
import { Provider } from 'react-redux';

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </Provider>
  );
}

export default trpc.withTRPC(App);
