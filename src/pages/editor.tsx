import type { NextPage } from 'next';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';
import { createScheme } from '../schemes/article';
import { z } from 'zod';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../lib/client/trpc';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;

  @media (min-width: 768px) {
    margin: 0 10em;
  }
`;

const Input = styled.input`
  padding: 0.7em;
  border-radius: 0.2em;
  border: 1px solid lightgrey;

  &::placeholder {
    font-family: Arial;
  }
`;

const Button = styled.button`
  appearance: none;
  border: none;
  color: white;
  background: #5cb85c;
  width: 6em;
  padding: 1em;
  border-radius: 0.2em;
  align-self: flex-end;
`;

const ParseTagList = ({
  value = [],
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) => {
  const [text, setText] = useState<string>(value.join('\n'));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setText(value);
    onChange(value.split(','));
  };

  return (
    <Input
      type="text"
      onChange={handleChange}
      value={text}
      placeholder="Enter tags"
    />
  );
};

type CreateScheme = z.infer<typeof createScheme>;
const Editor: NextPage = () => {
  const { register, handleSubmit, control } = useForm<CreateScheme>({
    resolver: zodResolver(createScheme),
  });

  const createArticle = trpc.articles.create.useMutation();
  const router = useRouter();

  const onSubmit = async (data: CreateScheme) => {
    await createArticle.mutateAsync(data);
    router.push('/');
  };

  const onSubmitError = (errors: any) => {
    console.log(errors);
  };

  return (
    <UserProvider>
      <Layout>
        <Form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <Input
            type="text"
            placeholder="Article Title"
            {...register('title')}
          />
          <Input
            type="text"
            placeholder="What's this article about?"
            {...register('description')}
          />
          <Input
            as="textarea"
            placeholder="Write your article (in markdown)"
            style={{ resize: 'vertical' }}
            {...register('body')}
          />
          <Controller
            name="tagList"
            render={({ field }) => {
              const { ref, ...nonRefField } = field;

              return <ParseTagList {...nonRefField} value={[]} />;
            }}
            control={control}
          />
          <Button type="submit">Publish Article</Button>
        </Form>
      </Layout>
    </UserProvider>
  );
};

export default Editor;
