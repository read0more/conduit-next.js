import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';

const Editor: NextPage = () => {
  return (
    <UserProvider>
      <Layout>
        <div>Editor</div>
      </Layout>
    </UserProvider>
  );
};

export default Editor;
