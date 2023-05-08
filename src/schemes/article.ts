import { z } from 'zod';

export const createScheme = z.object({
  title: z.string().min(1).max(30),
  description: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  tagList: z.array(z.string()).optional(),
});