import { z } from 'zod';

export const registrationSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[!@#$%^&*]/),
  email: z.string().email(),
  username: z.string(),
  image: z.string().url().nullable(),
  bio: z.string().nullable(),
});

export const loginSchema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
  })
  .partial({
    email: true,
    username: true,
  })
  .refine(
    (data) => data.email || data.username,
    'Either email or username should be filled in.'
  );
