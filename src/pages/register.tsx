import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from 'src/components/Layout';
import UserProvider from 'src/lib/client/UserProvider';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../schemes/user';
import z from 'zod';
import { trpc } from '../lib/client/trpc';
import { useRouter } from 'next/router';

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

type RegistrationSchemaType = z.infer<typeof registrationSchema>;
const Register: NextPage = () => {
  const { register, handleSubmit, formState } = useForm<RegistrationSchemaType>(
    {
      resolver: zodResolver(registrationSchema),
    }
  );
  const registerUser = trpc.users.registration.useMutation();
  const router = useRouter();

  const onSubmit = async (data: RegistrationSchemaType) => {
    await registerUser.mutateAsync(data);
    router.push('/login');
  };

  const onSubmitError = (errors: any) => {
    console.log(errors);
  };

  return (
    <UserProvider>
      <Layout>
        <Title>Sign up</Title>
        <AccountLInk href="/register">Have an account?</AccountLInk>
        <Form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <Input type="text" placeholder="Username" {...register('username')} />
          <Input type="text" placeholder="Email" {...register('email')} />
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          <Button type="submit">Sign up</Button>
        </Form>
      </Layout>
    </UserProvider>
  );
};

export default Register;
