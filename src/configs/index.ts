import { registerAs } from '@nestjs/config';

export const GoogleConfig = registerAs('google', () => ({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
}));

export const JwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
  refreshSecret: process.env.REFRESH_JWT_SECRET,
  refreshExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
}));
