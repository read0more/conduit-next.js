import { z } from 'zod';

export const listScheme = z.object({
  limit: z.number().int().min(1).max(20).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
});
