import { z } from 'zod';

export const registrationSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[!@#$%^&*]/),
  email: z.string().email(),
  username: z
    .string()
    .min(4)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'The username must contain only letters, numbers and underscore (_)'
    ),
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

export const updateUserSchema = registrationSchema;
export const getProfileSchema = z.object({
  username: z.string(),
});

export const followSchema = z.object({
  followingId: z.number(),
});
