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

type ArticleWhere = (typeof prisma.article.findMany)['arguments'][0]['where'];

const list = procedure.input(listScheme).query(async ({ input }) => {
  const { limit, offset, ...restInput } = input;

  const where: ArticleWhere = {};

  if (restInput.author) {
    where.author = {
      username: restInput.author,
    };
  }

  if (restInput.favorited) {
    where.favorites = {
      some: {
        username: restInput.favorited,
      },
    };
  }

  if (restInput.tag) {
    where.tagList = {
      some: {
        name: restInput.tag,
      },
    };
  }

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
    const { limit, offset, ...restInput } = input;
    const user = ctx.user!;
    const where: ArticleWhere = {};

    where.author = {
      following: {
        some: {
          followerId: user.id,
        },
      },
    };

    if (restInput.author) {
      where.author = {
        username: restInput.author,
      };
    }

    if (restInput.favorited) {
      where.favorites = {
        some: {
          username: restInput.favorited,
        },
      };
    }

    if (restInput.tag) {
      where.tagList = {
        some: {
          name: restInput.tag,
        },
      };
    }

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

const remove = protectedProcedure
  .input(deleteScheme)
  .mutation(async ({ input, ctx: { user } }) => {
    const article = await prisma.article.findFirst({
      where: {
        slug: input.slug,
        authorId: user!.id,
      },
    });

    if (!article) {
      // TODO: 403으로 처리
      throw new Error('Article not found');
    }

    await prisma.article.delete({
      where: {
        id: article.id,
      },
    });

    return {
      article,
    };
  });

const favorite = protectedProcedure
  .input(favoriteScheme)
  .mutation(async ({ input, ctx: { user } }) => {
    const article = await prisma.article.findFirst({
      where: {
        slug: input.slug,
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

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
