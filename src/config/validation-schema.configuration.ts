import * as Joi from 'joi';

export function validationSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('development', 'testing', 'staging', 'preprod', 'prod').exist(),

    DB_HOST: Joi.string().exist(),
    DB_PORT: Joi.number().exist(),
    DB_USERNAME: Joi.string().exist(),
    DB_PASSWORD: Joi.string().exist(),
    DB_NAME: Joi.string().exist(),
    DB_SYNCHRONIZE: Joi.bool().exist(),

    REDIS_HOST: Joi.string().exist(),
    REDIS_PORT: Joi.number().exist(),
    REDIS_PASSWORD: Joi.string().exist(),

    THROTTLE_TTL: Joi.number().exist(),
    THROTTLE_LIMIT: Joi.number().exist(),

    ENCRYPTION_KEY: Joi.string().exist(),
    ENCRYPTION_IV: Joi.string().exist(),

    JWT_SECRET: Joi.string().exist(),
    JWT_EXPIRES_IN: Joi.string().exist(),
  });
}
