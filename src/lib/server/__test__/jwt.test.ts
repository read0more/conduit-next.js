import { expect, test } from 'vitest';
import { generateToken, verifyToken } from '../jwt';
import { UserToken } from 'src/types/userToken';

const testSecret = 'secret';
const testExpiration = 86400;

test('verify token', () => {
  const payload = {
    id: 1,
    email: 'test@gmail.com',
    username: 'name',
  } as UserToken;

  const token = generateToken(payload, testSecret, testExpiration);
  const decoded = verifyToken(token, testSecret);

  for (const [key, value] of Object.entries(payload)) {
    expect(decoded[key]).toBe(value);
  }
});
