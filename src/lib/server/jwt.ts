import { sign, verify } from 'jsonwebtoken';
import { UserToken } from 'src/types/userToken';

export const generateToken = (
  payload: UserToken,
  secret: string,
  expiresIn: string | number | undefined
) => {
  return sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string): UserToken => {
  return verify(token, secret) as UserToken;
};
