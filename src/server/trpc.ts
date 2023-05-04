import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from 'src/server/routers/context';

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({ ctx });
});

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = procedure.use(isAuthed);
