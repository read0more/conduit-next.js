import { listScheme } from 'src/schemes/tag';
import { procedure, router } from '../trpc';
import prisma from 'src/lib/server/prismaClient';

const list = procedure.input(listScheme).query(async ({ input }) => {
  const { limit, offset } = input;

  const tags = await prisma.tag.findMany({
    take: limit,
    skip: offset,
  });

  return {
    tags,
  };
});

export const tagsRouter = router({
  list,
});

export type TagsRouter = typeof tagsRouter;
