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
  GEMINI_API_KEY: optionalEnvString,
  GEMINI_MODEL: optionalEnvString,
  PRODUCTS_DATABASE_URL: optionalEnvUrl,
  SUPABASE_AUTH_DATABASE_URL: optionalEnvUrl,
  
  CLOUDFLARE_ACCOUNT_ID: optionalEnvString,
  CLOUDFLARE_API_TOKEN: optionalEnvString,
  CLOUDFLARE_S3_URL: optionalEnvUrl,
  CLOUDFLARE_ACCESS_KEY_ID: optionalEnvString,
  CLOUDFLARE_SECRET_ACCESS_KEY: optionalEnvString,
});

/**
 * Normalize Cloudflare env aliases.
 * S3 keys must stay an **intact pair** (same source for access + secret).
 * Do not treat API tokens / Authorization headers as S3 secrets.
 */
const envSchemaWithAliases = z.preprocess((rawEnv: unknown) => {
  const env = (rawEnv ?? {}) as Record<string, string | undefined>;

  const r2Access = env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim();
  const r2Secret = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();
  const access = env.CLOUDFLARE_ACCESS_KEY_ID?.trim();
  const secret = env.CLOUDFLARE_SECRET_ACCESS_KEY?.trim();
  const typoAccess = env.CLOULD_ACCESS_KEY_ID?.trim();
  const typoSecret = env.CLOULDFLARE_S3_SECRET_ACCESS_KEY?.trim();

  let resolvedAccess = access;
  let resolvedSecret = secret;
  if (r2Access && r2Secret) {
    resolvedAccess = r2Access;
    resolvedSecret = r2Secret;
  } else if (access && secret) {
    resolvedAccess = access;
    resolvedSecret = secret;
  } else if (typoAccess && typoSecret) {
    resolvedAccess = typoAccess;
    resolvedSecret = typoSecret;
  } else {
    // Incomplete pairs must not partially leak into the schema.
    resolvedAccess = undefined;
    resolvedSecret = undefined;
  }

  return {
    ...env,
    CLOUDFLARE_API_TOKEN:
      env.CLOUDFLARE_API_TOKEN ||
      env.CLOOUDFLARE_SECRET_API_TOKEN ||
      env.CLOULDFLARE_S3_API_TOKEN ||
      env.CLOUDFLARE_SECRET_API_TOKEN,
    // Prefer real S3 endpoint URL; do not fall back to dashboard CLOULDFLARE_URL.
    CLOUDFLARE_S3_URL: env.CLOUDFLARE_S3_URL || env.CLOULDFLARE_S3_URL,
    CLOUDFLARE_ACCESS_KEY_ID: resolvedAccess,
    CLOUDFLARE_SECRET_ACCESS_KEY: resolvedSecret,
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
