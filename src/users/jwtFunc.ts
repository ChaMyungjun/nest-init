import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

export const generateToken = (config: any) => {
  const random = randomBytes(21).toString('base64').slice(0, 21);
  const token = sign({ random }, 'nesSettingKey', {
    expiresIn: '1d',
  });
  return token;
};

export const generateRefresh = (config: any) => {
  const random = randomBytes(21).toString('base64').slice(0, 21);
  const token = sign({ random }, 'nesSettingKey');
  return token;
};
