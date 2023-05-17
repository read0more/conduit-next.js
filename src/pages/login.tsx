import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';

const Login: NextPage = () => {
  return (
    <UserProvider>
      <Layout>
        <div>Login</div>
      </Layout>
    </UserProvider>
  );
};

export default Login;
