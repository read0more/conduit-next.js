import {
  registrationSchema,
  loginSchema,
  updateProfileSchema,
  getProfileSchema,
  followSchema,
} from 'src/schemes/user';
import { router, procedure, protectedProcedure } from '../trpc';
import prisma from 'src/lib/server/prismaClient';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { Context } from 'src/server/routers/context';
import { TRPCError } from '@trpc/server';
import { generateToken } from 'src/lib/server/jwt';
import { env } from 'src/env.mjs';

const saltOrRounds = 10;
const registration = procedure
  .input(registrationSchema)
  .mutation(async ({ input }) => {
    const emailExists = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (emailExists) {
      throw new z.ZodError([
        {
          code: 'custom',
          path: ['email'],
          message: 'This email already exists',
        },
      ]);
    }

    const usernameExists = await prisma.user.findUnique({
      where: {
        username: input.username,
      },
    });

    if (usernameExists) {
      throw new z.ZodError([
        {
          code: 'custom',
          path: ['username'],
          message: 'This username already exists',
        },
      ]);
    }

    const hashedPassword = await bcrypt.hash(input.password, saltOrRounds);
    const newUser = await prisma.user.create({
      data: { ...input, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
    };
  });

const login = procedure
  .input(loginSchema)
  .mutation(
    async ({
      input,
      ctx,
    }: {
      input: z.infer<typeof loginSchema>;
      ctx: Context;
    }) => {
      const { email, username, password } = input;
      const where = email ? { email } : { username };

      const user = await prisma.user.findFirst({
        where,
      });

      const match = await bcrypt.compare(password, user?.password ?? '');

      if (!match || !user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Please check your email or username and password',
        });
      }

      const token = generateToken(
        user,
        env.JWT_ACCESS_TOKEN_SECRET,
        env.JWT_ACCESS_TOKEN_EXPIRATION
      );

      ctx.setTokenCookie(token);
    }
  );

const user = protectedProcedure.query(async ({ ctx }) => {
  const { password: _, ...userWithoutPassword } = ctx.user!;

  return userWithoutPassword;
});

const update = protectedProcedure
  .input(updateProfileSchema)
  .mutation(async ({ input, ctx }) => {
    const user = ctx.user!;
    input.password = await bcrypt.hash(input.password, saltOrRounds);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: input,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  });

const profile = procedure
  .input(getProfileSchema)
  .query(async ({ input, ctx }) => {
    const myId = ctx?.user?.id;
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          username: input.username,
        },
        include: {
          follower: true,
        },
      });

      const following = !!user.follower?.find(
        (user) => user.followerId === myId
      );
      return { ...user, following };
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
  });

export const follow = protectedProcedure
  .input(followSchema)
  .mutation(async ({ input, ctx }) => {
    const exists = await prisma.follow.findFirst({
      where: {
        followerId: ctx.user!.id,
        followingId: input.followingId,
      },
    });

    if (exists) {
      await prisma.follow.delete({
        where: {
          id: exists.id,
        },
      });
    } else {
      await prisma.follow.create({
        data: {
          followerId: ctx.user!.id,
          followingId: input.followingId,
        },
      });
    }
  });

export const userRouter = router({
  registration,
  login,
  user,
  update,
  profile,
  follow,
});

export type UserRouter = typeof userRouter;
