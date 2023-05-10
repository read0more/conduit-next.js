import { router } from '../trpc';
import { userRouter as users } from './users';
import { articleRouter as articles } from './articles';
import { commentsRouter as comments } from './comments';

export const appRouter = router({
  users,
  articles,
  comments,
});
// export type definition of API
export type AppRouter = typeof appRouter;
