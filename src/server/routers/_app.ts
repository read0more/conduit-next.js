import { router } from '../trpc';
import { userRouter as users } from './users';

export const appRouter = router({
  users,
});
// export type definition of API
export type AppRouter = typeof appRouter;
