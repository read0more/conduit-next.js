import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';

const Settings: NextPage = () => {
  return (
    <UserProvider>
      <Layout>
        <div>Settings</div>
      </Layout>
    </UserProvider>
  );
};

export default Settings;
