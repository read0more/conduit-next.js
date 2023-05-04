import { rest } from 'msw';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  rest.get('https://the_api_url_you_want.com', (_, res, ctx) =>
    res(ctx.json({}))
  ),
];
