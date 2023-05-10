import { z } from 'zod';

export const createScheme = z.object({
  slug: z.string().min(1),
  body: z.string().min(1).max(200),
});

export const getScheme = z.object({
  slug: z.string().min(1),
});

export const updateScheme = createScheme;

export const deleteScheme = getScheme;
