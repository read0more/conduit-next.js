import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

interface SuccessResponseType {
  ok: true;
  [key: string]: any;
}

interface ErrorResponseType {
  ok: false;
  error: any;
}

export type ResponseType = SuccessResponseType | ErrorResponseType;

type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ConfigType {
  methods: method[];
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => void | Promise<unknown>;
  isPrivate?: boolean;
}

export default function withHandler({
  methods,
  isPrivate = true,
  handler,
}: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as method)) {
      return res.status(405).end();
    }

    // TODO: isPrivate에 따라 로그인 여부 검사

    try {
      await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: error.issues,
        });
      }

      return res.status(500).json({ error });
    }
  };
}
