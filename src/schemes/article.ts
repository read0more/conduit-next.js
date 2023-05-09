import { z } from 'zod';

export const createScheme = z.object({
  title: z.string().min(1).max(30),
  description: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  tagList: z.array(z.string()).optional(),
});

export const updateScheme = createScheme.partial().extend({
  slug: z.string().min(1),
});

export const getScheme = z.object({
  slug: z.string().min(1),
});

export const deleteScheme = getScheme;

export const favoriteScheme = getScheme;

export const listScheme = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
  limit: z.number().int().min(1).max(20).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
});

export const feedScheme = listScheme;
