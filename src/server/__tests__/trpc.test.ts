import { TRPCError } from '@trpc/server';
import { createContextInner } from '../routers/context';
import { protectedProcedure, router } from '../trpc';

describe('protectedProcedure', () => {
  it('throw TRPCError when token is falsy', async () => {
    const protectedRouter = router({
      test: protectedProcedure.mutation(() => {}),
    });
    const ctx = await createContextInner({
      token: '',
      setTokenCookie: () => {},
      user: null,
    });
    const caller = protectedRouter.createCaller(ctx);
    await expect(caller.test()).rejects.toBeInstanceOf(TRPCError);
  });

  it('works fine with truthy token', async () => {
    const protectedRouter = router({
      test: protectedProcedure.mutation(() => {}),
    });
    const ctx = await createContextInner({
      token: 'this_is_token',
      setTokenCookie: () => {},
      user: null,
    });
    const caller = protectedRouter.createCaller(ctx);
    await expect(caller.test()).resolves.toBeUndefined();
  });
});
