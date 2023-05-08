import { createScheme, updateScheme } from 'src/schemes/article';
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

const update = protectedProcedure
  .input(updateScheme)
  .mutation(async ({ input, ctx }) => {
    const user = ctx.user!;
    const { slug, ...rest } = input;

    const article = await prisma.article.findFirst({
      where: {
        slug,
        authorId: user.id,
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const title = input.title ?? article.title;
    const tagList = input.tagList ?? [];
    const updatedArticle = await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        ...rest,
        slug: title.toLowerCase().replace(/ /g, '-'),
        tagList: {
          connectOrCreate: tagList.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    return {
      article: updatedArticle,
    };
  });

export const articleRouter = router({
  create,
  update,
});

export type ArticleRouter = typeof articleRouter;
