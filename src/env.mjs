import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_ACCESS_TOKEN_SECRET: z.string().min(10),
    JWT_ACCESS_TOKEN_EXPIRATION: z.coerce.number().int().positive(),
    IRON_COOKIE_NAME: z.string().min(1),
    IRON_COOKIE_PASSWORD: z.string().min(32),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    IRON_COOKIE_NAME: process.env.IRON_COOKIE_NAME,
    IRON_COOKIE_PASSWORD: process.env.IRON_COOKIE_PASSWORD,
  },
});
