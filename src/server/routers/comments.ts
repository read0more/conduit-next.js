import { createScheme, getScheme } from 'src/schemes/comments';
import { procedure, protectedProcedure, router } from '../trpc';
import prisma from 'src/lib/server/prismaClient';

const create = protectedProcedure
  .input(createScheme)
  .mutation(async ({ input, ctx }) => {
    const { slug, body } = input;
    const { user } = ctx;

    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        author: {
          connect: {
            id: user?.id,
          },
        },
        article: {
          connect: {
            id: article.id,
          },
        },
      },
    });

    return {
      comment,
    };
  });

export const commentsRouter = router({
  create,
});

export type CommentsRouter = typeof commentsRouter;
