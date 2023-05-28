import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemes/user';
import z from 'zod';
import { trpc } from '../lib/client/trpc';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Title = styled.h2`
  text-align: center;
  margin: 0;
`;
const AccountLInk = styled(Link)`
  display: block;
  text-align: center;
  color: inherit;
  text-decoration: none;
  margin: 0.7em 0;
  color: #5cb85c;
`;
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

const ErrorParagraph = styled.p`
  color: red;
  font-weight: bold;
  margin-bottom: 0;
`;

type LoginSchemaType = z.infer<typeof loginSchema>;
const Login: NextPage = () => {
  const { register, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState('');
  const login = trpc.users.login.useMutation();
  const router = useRouter();

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login.mutateAsync(data);
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError('An error occurred');
    }
  };

  return (
    <UserProvider>
      <Layout>
        <Title>Sign In</Title>
        <AccountLInk href="/register">Need an account?</AccountLInk>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorParagraph>{error}</ErrorParagraph>}
          <Input type="text" placeholder="Username" {...register('username')} />
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          <Button type="submit">Sign in</Button>
        </Form>
      </Layout>
    </UserProvider>
  );
};

export default Login;
