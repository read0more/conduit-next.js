import {
  createScheme,
  deleteScheme,
  getScheme,
  updateScheme,
} from 'src/schemes/comments';
import { procedure, protectedProcedure, router } from '../trpc';
import prisma from 'src/lib/server/prismaClient';

const create = protectedProcedure
  .input(createScheme)
  .mutation(async ({ input, ctx }) => {
    const { slug, body } = input;
    const { user } = ctx;

    const article = await prisma.article.findUniqueOrThrow({
      where: {
        slug,
      },
    });

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

const get = procedure.input(getScheme).query(async ({ input }) => {
  const { slug } = input;

  const comments = await prisma.comment.findMany({
    where: {
      article: {
        slug,
      },
    },
  });

  return {
    comments,
  };
});

const update = protectedProcedure
  .input(updateScheme)
  .mutation(async ({ input, ctx }) => {
    const { id, body } = input;
    const { user } = ctx;

    const comment = await prisma.comment.findFirstOrThrow({
      where: {
        id,
        authorId: user?.id,
      },
    });

    const updatedComment = await prisma.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        body,
      },
    });

    return {
      comment: updatedComment,
    };
  });

const remove = protectedProcedure
  .input(deleteScheme)
  .mutation(async ({ input, ctx }) => {
    const { id } = input;
    const { user } = ctx;

    const comment = await prisma.comment.findFirstOrThrow({
      where: {
        id,
        authorId: user?.id,
      },
    });

    await prisma.comment.delete({
      where: {
        id: comment.id,
      },
    });

    return {
      comment,
    };
  });

export const commentsRouter = router({
  create,
  get,
  update,
  remove,
});

export type CommentsRouter = typeof commentsRouter;
