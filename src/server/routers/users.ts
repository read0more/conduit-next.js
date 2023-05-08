import {
  registrationSchema,
  loginSchema,
  updateUserSchema,
} from 'src/schemes/users';
import { router, procedure, protectedProcedure } from '../trpc';
import prisma from 'src/lib/server/prismaClient';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { Context } from 'src/server/routers/context';
import { TRPCError } from '@trpc/server';
import { generateToken, verifyToken } from 'src/lib/server/jwt';

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
        process.env.JWT_ACCESS_TOKEN_SECRET!,
        process.env.JWT_ACCESS_TOKEN_EXPIRATION!
      );

      ctx.setTokenCookie(token);
    }
  );

const user = protectedProcedure.query(async ({ ctx }) => {
  const user = verifyToken(ctx.token!, process.env.JWT_ACCESS_TOKEN_SECRET!);
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
});

const update = protectedProcedure
  .input(updateUserSchema)
  .mutation(async ({ input, ctx }) => {
    const user = verifyToken(ctx.token!, process.env.JWT_ACCESS_TOKEN_SECRET!);
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

export const userRouter = router({
  registration,
  login,
  user,
  update,
});

export type UserRouter = typeof userRouter;
