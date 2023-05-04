import type { NextApiRequest, NextApiResponse } from 'next';
import withHandler from 'src/lib/server/withHandler';
import prisma from 'src/lib/server/prismaClient';
import z from 'zod';
import { User } from 'prisma-client';
import { loginSchema } from 'src/schemes/login';

type Data = {
  user: Omit<User, 'id' | 'password'>;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email, username, password } = loginSchema.parse(req.body);
  const where = email ? { email, password } : { username, password };

  const user = await prisma.user.findUnique({
    where,
  });

  if (!user) {
    throw new z.ZodError([
      {
        code: 'custom',
        path: ['user'],
        message: 'Please check your email or username and password',
      },
    ]);
  }

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json({ user: userWithoutPassword });
}

export default withHandler({
  methods: ['POST'],
  handler,
});
