import { registrationSchema, loginSchema } from 'src/schemes/users';
import { router, procedure } from '../trpc';
import prisma from 'src/lib/server/prismaClient';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { Context } from 'src/server/routers/context';
import { TRPCError } from '@trpc/server';
import { generateToken } from 'src/lib/server/jwt';

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

    const hashedPassword = await bcrypt.hash(input.password, 10);
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

export const userRouter = router({
  registration,
  login,
});

export type UserRouter = typeof userRouter;
