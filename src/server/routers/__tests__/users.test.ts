import { User } from 'prisma-client';
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
    username: 'test',
  };

  const newUser = {
    ...input,
    id: 1,
    bio: '',
    image: '',
  };

  prisma.user.create.mockResolvedValue(newUser);
  const { user } = await caller.registration(input);

  const { password: _, ...userWithoutPassword } = newUser;
  expect(user).toEqual(userWithoutPassword);
});

interface UserWithFollowing extends User {
  follower: {
    id: number;
    followerId: number;
    followingId: number;
  }[];
}
describe('profile', () => {
  it('following is true if the logged in user follows the profile', async () => {
    const loggedInUser = {
      id: 1,
      email: '',
      username: '',
      bio: '',
      image: '',
    };
    const ctx = await createContextInner({
      token: undefined,
      setTokenCookie: () => {},
      user: loggedInUser,
    });
    const caller = userRouter.createCaller(ctx);
    const input: inferProcedureInput<UserRouter['profile']> = {
      username: 'test',
    };

    const dummyProfile: UserWithFollowing = {
      id: 2,
      password: '$2b$10$vJcDBqU1E4wfVrpbmE.NluQi2I3wV6GGQF.ege7Jju5cD.NCFnDJa',
      email: 'test2@gamil.com',
      username: 'test2',
      image: 'https://google.com',
      bio: 'test2',
      follower: [
        { id: 1, followerId: 1, followingId: 2 },
        { id: 3, followerId: 3, followingId: 2 },
      ],
    };

    prisma.user.findFirstOrThrow.mockResolvedValue(dummyProfile);
    const profile = await caller.profile(input);

    expect(profile.following).toBe(true);
  });
  it('following is false if the logged in user follows the profile', async () => {
    const loggedInUser = {
      id: 1,
      email: '',
      username: '',
      bio: '',
      image: '',
    };
    const ctx = await createContextInner({
      token: undefined,
      setTokenCookie: () => {},
      user: loggedInUser,
    });
    const caller = userRouter.createCaller(ctx);
    const input: inferProcedureInput<UserRouter['profile']> = {
      username: 'test',
    };

    const dummyProfile: UserWithFollowing = {
      id: 2,
      password: '$2b$10$vJcDBqU1E4wfVrpbmE.NluQi2I3wV6GGQF.ege7Jju5cD.NCFnDJa',
      email: 'test2@gamil.com',
      username: 'test2',
      image: 'https://google.com',
      bio: 'test2',
      follower: [
        { id: 1, followerId: 4, followingId: 2 },
        { id: 3, followerId: 3, followingId: 2 },
      ],
    };

    prisma.user.findFirstOrThrow.mockResolvedValue(dummyProfile);
    const profile = await caller.profile(input);

    expect(profile.following).toBe(false);
  });
});
