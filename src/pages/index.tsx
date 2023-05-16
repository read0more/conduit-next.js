import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';

const Home: NextPage = () => {
  return (
    <UserProvider>
      <Layout>
        <div>Home</div>
      </Layout>
    </UserProvider>
  );
};

export default Home;
