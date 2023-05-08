import { inferProcedureInput } from '@trpc/server';
import { userRouter, UserRouter } from '../users';
import { createContextInner } from '../context';
import prisma from 'src/lib/server/__mocks__/prismaClient';

vi.mock('src/lib/server/prismaClient');

test('registration should return the generated user without password', async () => {
  const ctx = await createContextInner({
    token: undefined,
    setTokenCookie: () => {},
    user: null,
  });
  const caller = userRouter.createCaller(ctx);
  const input: inferProcedureInput<UserRouter['registration']> = {
    email: 'test@gmail.com',
    password: 'tesSt3@d!@',
    image: 'https://some_image.com',
    username: 'test',
    bio: '',
  };

  const newUser = {
    ...input,
    id: 1,
  };

  prisma.user.create.mockResolvedValue(newUser);
  const { user } = await caller.registration(input);

  const { password: _, ...userWithoutPassword } = newUser;
  expect(user).toEqual(userWithoutPassword);
});
