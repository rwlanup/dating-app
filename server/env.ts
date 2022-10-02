/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
import * as z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PUSHER_APP_ID: z.string(),
  PUSHER_SECRET: z.string(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  NEXT_PUBLIC_PUSHER_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 4));
  process.exit(1);
}

export const env = _env.data;
