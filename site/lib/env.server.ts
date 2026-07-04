import { z } from "zod";

const optionalEnvString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalEnvUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional(),
);

const envSchema = z.object({
  OPENAI_API_KEY: optionalEnvString,
  OPENROUTER_API_KEY_PRIMARY: optionalEnvString,
  OPENROUTER_API_KEY_BACKUP: optionalEnvString,
  OPENROUTER_MODEL: optionalEnvString,
  PRODUCTS_DATABASE_URL: optionalEnvUrl,
  SUPABASE_AUTH_DATABASE_URL: optionalEnvUrl,
  
  CLOUDFLARE_ACCOUNT_ID: optionalEnvString,
  CLOUDFLARE_API_TOKEN: optionalEnvString,
  CLOUDFLARE_S3_URL: optionalEnvUrl,
  CLOUDFLARE_ACCESS_KEY_ID: optionalEnvString,
  CLOUDFLARE_SECRET_ACCESS_KEY: optionalEnvString,
});

const envSchemaWithAliases = z.preprocess((rawEnv: unknown) => {
  const env = (rawEnv ?? {}) as Record<string, string | undefined>;
  return {
  ...env,
  CLOUDFLARE_API_TOKEN: env.CLOUDFLARE_API_TOKEN || env.CLOOUDFLARE_SECRET_API_TOKEN || env.CLOULDFLARE_S3_API_TOKEN || env.CLOUDFLARE_SECRET_API_TOKEN,
  CLOUDFLARE_S3_URL: env.CLOUDFLARE_S3_URL || env.CLOULDFLARE_S3_URL || env.CLOULDFLARE_URL,
  CLOUDFLARE_ACCESS_KEY_ID: env.CLOUDFLARE_ACCESS_KEY_ID || env.CLOULD_ACCESS_KEY_ID,
  CLOUDFLARE_SECRET_ACCESS_KEY: env.CLOUDFLARE_SECRET_ACCESS_KEY || env.CLOULDFLARE_S3_SECRET_ACCESS_KEY || env.CLOUDFLARE_SECRET_Authorization,
  CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
  };
}, envSchema);

type ServerEnv = z.infer<typeof envSchema>;

function readEnv(): ServerEnv {
  const parsedEnv = envSchemaWithAliases.safeParse(process.env);

  if (!parsedEnv.success) {
    console.error("Invalid server environment variables:", parsedEnv.error.format());
    throw new Error("Invalid server environment variables");
  }

  return parsedEnv.data;
}

export const env = new Proxy({} as ServerEnv, {
  get(_target, property: string) {
    return readEnv()[property as keyof ServerEnv];
  },
});
