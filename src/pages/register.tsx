import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';

const Register: NextPage = () => {
  return (
    <UserProvider>
      <Layout>
        <div>Register</div>
      </Layout>
    </UserProvider>
  );
};

export default Register;
