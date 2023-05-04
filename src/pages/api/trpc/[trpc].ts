import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from 'src/server/routers/_app';
import { createContext } from 'src/server/routers/context';
// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
