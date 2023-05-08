import { router } from '../trpc';
import { userRouter as users } from './users';
import { articleRouter as articles } from './articles';

export const appRouter = router({
  users,
  articles,
});
// export type definition of API
export type AppRouter = typeof appRouter;
