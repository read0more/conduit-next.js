import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { verifyToken } from 'src/lib/server/jwt';
import { env } from 'src/env.mjs';
import { UserToken } from 'src/types/userToken';

interface CreateInnerContextOptions {
  token: string | undefined;
  setTokenCookie: (token: string) => void;
  user: UserToken | null;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner({
  token,
  setTokenCookie,
  user,
}: CreateInnerContextOptions) {
  return {
    token,
    setTokenCookie,
    user,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  // for API-response caching see https://trpc.io/docs/caching
  const token = opts.req.cookies.token;
  const user = token ? verifyToken(token, env.JWT_ACCESS_TOKEN_SECRET) : null;

  const setTokenCookie = (token: string) => {
    const oneDay = 1000 * 60 * 60 * 24;

    opts.res.setHeader(
      'Set-Cookie',
      `token=${token}; path=/; expires=${new Date(
        Date.now() + oneDay
      ).toUTCString()}; HttpOnly; SameSite=Strict; Secure`
    );
  };

  const contextInner = await createContextInner({
    token,
    setTokenCookie,
    user,
  });

  return {
    ...contextInner,
  };
}
