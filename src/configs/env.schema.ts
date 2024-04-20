import * as Joi from 'joi';

export const envSchema = Joi.object({
  //client setup (optional)
  CLIENT_URL: Joi.string().optional(),

  //server application setup
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'production', 'test')
    .default('local'),
  PORT: Joi.number().default(5000),

  //database setup
  PG_USERNAME: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_HOST: Joi.string().required(),
  PG_DB: Joi.string().required(),
  PG_PORT: Joi.number().required(),

  //google auth2 setup
  GOOGLE_ID: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('fake'),
  }),
  GOOGLE_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('fake'),
  }),

  //jwt setup
  JWT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('non-secure-secret-key'),
  }),
  JWT_EXPIRES_IN: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('5m'),
  }),
  REFRESH_JWT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('non-secure-secret-key-2'),
  }),
  REFRESH_JWT_EXPIRES_IN: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('182d'),
  }),

  //rate limit (optional)
  SECURITY_THROTTLE_TTL: Joi.number().optional().default(60_000),
  SECURITY_THROTTLE_LIMIT: Joi.number().optional().default(1_000_000),
});
