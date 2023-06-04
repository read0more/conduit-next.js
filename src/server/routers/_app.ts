import { tagsRouter as tags } from './tags';
import { router } from '../trpc';
import { userRouter as users } from './users';
import { articleRouter as articles } from './articles';
import { commentsRouter as comments } from './comments';

export const appRouter = router({
  users,
  articles,
  comments,
  tags,
});
// export type definition of API
export type AppRouter = typeof appRouter;
