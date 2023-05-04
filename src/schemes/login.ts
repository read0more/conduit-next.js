import { z } from 'zod';

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
