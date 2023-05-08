import { env } from './env.mjs';

declare module 'src/env.mjs' {
  export const env: env;
}
