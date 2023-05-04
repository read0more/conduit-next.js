import { JwtPayload } from 'jsonwebtoken';
import { User } from 'prisma-client';

export type UserToken = JwtPayload & Omit<User, 'password'>;
