import React from 'react';
import styled from 'styled-components';
import { trpc } from '../../lib/client/trpc';

const Aside = styled.aside`
  background-color: #f3f3f3;
  padding: 0.5em;
  margin-left: 1em;
  max-width: 15%;
`;

const AsideTitle = styled.h2`
  padding: 0;
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
`;

const Ul = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LiChip = styled.li`
  display: inline-block;
  background-color: #687077;
  color: white;
  padding: 0.5em;
  margin: 0.5em;
  border-radius: 0.5em;
  font-size: 0.8rem;
  cursor: pointer;
`;

interface Props {
  onClickTag: (tag: string) => void;
}

export default function Tags({ onClickTag }: Props) {
  const { data } = trpc.tags.list.useQuery({ limit: 10 });

  return (
    <Aside>
      <AsideTitle>Popular Tags</AsideTitle>
      <Ul>
        {data?.tags.map((tag) => (
          <LiChip
            key={tag.id}
            onClick={() => {
              onClickTag(tag.name);
            }}
          >
            {tag.name}
          </LiChip>
        ))}
      </Ul>
    </Aside>
  );
}
