import {
  createScheme,
  deleteScheme,
  favoriteScheme,
  feedScheme,
  getScheme,
  listScheme,
  updateScheme,
} from 'src/schemes/article';
import { router, procedure, protectedProcedure } from '../trpc';
import prisma from 'src/lib/server/prismaClient';
import { z } from 'zod';

type ArticleWhere = (typeof prisma.article.findMany)['arguments'][0]['where'];

function getListWhereCondition(
  input: z.infer<typeof listScheme>
): ArticleWhere {
  const where: ArticleWhere = {};

  if (input.author) {
    where.author = {
      username: input.author,
    };
  }

  if (input.favorited) {
    where.favorites = {
      some: {
        username: input.favorited,
      },
    };
  }

  if (input.tag) {
    where.tagList = {
      some: {
        name: input.tag,
      },
    };
  }

  return where;
}

const list = procedure.input(listScheme).query(async ({ input }) => {
  const { limit, offset } = input;
  const where: ArticleWhere = getListWhereCondition(input);

  const articles = await prisma.article.findMany({
    where,
    take: limit,
    skip: offset,
    include: {
      tagList: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    articles,
  };
});

const feed = protectedProcedure
  .input(feedScheme)
  .query(async ({ input, ctx }) => {
    const { limit, offset } = input;
    const user = ctx.user!;
    const where: ArticleWhere = getListWhereCondition(input);

    where.author = {
      following: {
        some: {
          followerId: user.id,
        },
      },
    };

    const articles = await prisma.article.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        tagList: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      articles,
    };
  });

const get = procedure.input(getScheme).query(async ({ input }) => {
  const article = await prisma.article.findFirst({
    where: {
      slug: input.slug,
    },
    include: {
      tagList: true,
    },
  });

  if (!article) {
    throw new Error('Article not found');
  }

  return {
    article,
  };
});

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

    const article = await prisma.article.findFirstOrThrow({
      where: {
        slug,
        authorId: user.id,
      },
    });

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

const remove = protectedProcedure
  .input(deleteScheme)
  .mutation(async ({ input, ctx: { user } }) => {
    const article = await prisma.article.findFirstOrThrow({
      where: {
        slug: input.slug,
        authorId: user!.id,
      },
    });

    await prisma.article.delete({
      where: {
        slug: input.slug,
      },
    });

    return {
      article,
    };
  });

const favorite = protectedProcedure
  .input(favoriteScheme)
  .mutation(async ({ input, ctx: { user } }) => {
    const article = await prisma.article.findFirstOrThrow({
      where: {
        slug: input.slug,
      },
    });

    const exists = await prisma.favorite.findFirst({
      where: {
        articleId: article.id,
        userId: user!.id,
      },
    });

    if (exists) {
      await prisma.favorite.delete({
        where: {
          id: exists.id,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          articleId: article.id,
          userId: user!.id,
        },
      });
    }

    return {
      article: {
        ...article,
        favorited: true,
      },
    };
  });

export const articleRouter = router({
  create,
  update,
  remove,
  get,
  list,
  feed,
  favorite,
});

export type ArticleRouter = typeof articleRouter;
