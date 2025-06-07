import {z} from 'zod';
import {createEnv} from '@t3-oss/env-nextjs';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AWS_COGNITO_USERNAME: z.string(),
    AWS_COGNITO_PASSWORD: z.string(),
    AWS_COGNITO_CLIENT_ID: z.string(),
    AWS_COGNITO_CLIENT_SECRET: z.string(),
    AWS_COGNITO_REGION: z.string(),
    AWS_COGNITO_USER_POOL_ID: z.string(),
    AWS_COGNITO_USER_POOL_CLIENT_ID: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },

  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AWS_COGNITO_USERNAME: process.env.AWS_COGNITO_USERNAME,
    AWS_COGNITO_PASSWORD: process.env.AWS_COGNITO_PASSWORD,
    AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
    AWS_COGNITO_CLIENT_SECRET: process.env.AWS_COGNITO_CLIENT_SECRET,
    AWS_COGNITO_REGION: process.env.AWS_COGNITO_REGION,
    AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
    AWS_COGNITO_USER_POOL_CLIENT_ID:
      process.env.AWS_COGNITO_USER_POOL_CLIENT_ID,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
