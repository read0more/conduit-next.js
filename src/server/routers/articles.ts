import { createScheme } from 'src/schemes/article';
import { router, procedure, protectedProcedure } from '../trpc';
import prisma from 'src/lib/server/prismaClient';

const create = protectedProcedure
  .input(createScheme)
  .mutation(async ({ input, ctx }) => {
    const user = ctx.user!;
    const tagList = input.tagList ?? [];

    const newArticle = await prisma.article.create({
      data: {
        ...input,
        slug: input.title.toLowerCase().replace(/ /g, '-'),
        authorId: user.id,
        tagList: {
          connectOrCreate: tagList.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tagList: true,
      },
    });

    return {
      article: newArticle,
    };
  });

export const articleRouter = router({
  create,
});

export type ArticleRouter = typeof articleRouter;
