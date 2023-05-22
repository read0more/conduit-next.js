import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import { useUser } from 'src/lib/client/UserProvider';
import styled from 'styled-components';
import Container from '../components/Container';

const Banner = styled.div`
  background-color: #5cb85c;
  box-shadow: inset 0 8px 8px -8px rgba(0, 0, 0, 0.3),
    inset 0 -8px 8px -8px rgba(0, 0, 0, 0.3);
  color: white;
  padding: 32px;
  margin-bottom: 32px;

  h1 {
    margin: 0;
    font-weight: 700;
    font-size: 3.5rem;
    text-align: center;
  }

  p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 300;
    text-align: center;
  }
`;

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  return (
    <Layout>
      {!user && !isLoading && (
        <Banner>
          <h1>conduit</h1>
          <p>A place to share your knowledge.</p>
        </Banner>
      )}
      <Container>home</Container>
    </Layout>
  );
};

export default Home;
