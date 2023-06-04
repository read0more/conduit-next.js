import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import { useUser } from 'src/lib/client/UserProvider';
import styled from 'styled-components';
import Container from '../components/Container';
import { useState } from 'react';
import { trpc } from '../lib/client/trpc';
import Tags from '../components/index/Tags';

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

const Contents = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Section = styled.section`
  flex: 1;
`;

const Ul = styled.ul`
  display: flex;
  justify-content: left;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #aaa;
  margin-bottom: 32px;
`;

const Button = styled.button<{ active?: string }>`
  cursor: pointer;
  color: ${({ active }) => (active ? '#5cb85c' : '#aaa')};
  background: none;
  border: none;
  padding: 16px;
  border-bottom: 3px solid
    ${({ active }) => (active ? '#5cb85c' : 'transparent')};
  font-weight: ${({ active }) => (active ? '700' : '400')};
  transform: ${({ active }) => (active ? 'translateY(1px);' : '')};
`;

const TABS = ['Your', 'Global'] as const;
const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const tabs = user ? TABS : TABS.slice(1);
  const [feedTab, setFeedTab] = useState<string>(tabs[0]);
  const [tag, setTag] = useState<string>();

  const onClickTag = (tag: string) => {
    setTag(tag);
    setFeedTab(tag);
  };

  const { data: globalFeed } = trpc.articles.list.useQuery(
    {},
    {
      enabled: feedTab === 'Global',
    }
  );

  const { data: myFeed } = trpc.articles.feed.useQuery(
    {},
    {
      enabled: feedTab === 'Your',
    }
  );

  const { data: feedIncludesTag } = trpc.articles.list.useQuery({
    tag,
  });

  let feed = globalFeed;

  if (feedTab === 'Your') {
    feed = myFeed;
  } else if (feedTab === tag) {
    feed = feedIncludesTag;
  }
  // const feed = feedTab === 'Global' ? globalFeed : myFeed;

  if (isLoading) return <div>Loading...</div>;
  return (
    <Layout>
      {!user && (
        <Banner>
          <h1>conduit</h1>
          <p>A place to share your knowledge.</p>
        </Banner>
      )}
      <Container>
        <nav>
          <Contents>
            <Section>
              <Ul>
                {tabs.map((tab) => (
                  <li key={tab}>
                    <Button
                      onClick={() => {
                        setFeedTab(tab);
                      }}
                      active={feedTab === tab ? 'true' : ''}
                    >
                      {tab} Feed
                    </Button>
                  </li>
                ))}
                {tag && (
                  <li>
                    <Button
                      onClick={() => {
                        setFeedTab(tag);
                      }}
                      active={feedTab === tag ? 'true' : ''}
                    >
                      {tag}
                    </Button>
                  </li>
                )}
              </Ul>
              <article>
                {feed?.articles.map((article) => (
                  <div key={article.slug}>
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                  </div>
                ))}
              </article>
            </Section>
            <Tags onClickTag={onClickTag} />
          </Contents>
        </nav>
      </Container>
    </Layout>
  );
};

export default Home;
