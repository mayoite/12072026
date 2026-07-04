/**
 * One-shot live proof: primary OpenRouter key fails → backup key returns real text.
 * Loads repo-root `.env.local` via loadEnvLocal.cjs. Never prints API keys.
 *
 * Usage: npx tsx scripts/live_openrouter_failover_stress.ts
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

async function main() {
  const { requestProviderText, resolveProviderChain } = await import("@/lib/ai/providerChain");

  const chain = resolveProviderChain();
  if (chain.length < 2) {
    console.error("Need OPENROUTER_API_KEY_PRIMARY and OPENROUTER_API_KEY_BACKUP in .env.local");
    process.exit(1);
  }

  const [primary, backup] = chain;
  const messages = [
    {
      role: "user" as const,
      content: "Reply with exactly the word OKAY and nothing else.",
    },
  ];

  const badPrimary = { ...primary, apiKey: process.env.MOCK_INVALID_API_KEY ?? "invalid-on-purpose-for-failover-stress" };

  console.log("Live OpenRouter failover stress");
  console.log(`Model: ${primary.model}`);

  try {
    await requestProviderText(badPrimary, messages, { temperature: 0 });
    console.error("FAIL: invalid primary key should not succeed");
    process.exit(1);
  } catch {
    console.log("Step 1/2: primary rejected invalid key (expected)");
  }

  let backupText: string;
  try {
    backupText = await requestProviderText(backup, messages, { temperature: 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("FAIL: backup provider did not return text:", message);
    process.exit(1);
  }

  const trimmed = backupText.trim();
  if (!trimmed) {
    console.error("FAIL: backup returned empty text");
    process.exit(1);
  }

  console.log("Step 2/2: backup returned live text");
  console.log(
    JSON.stringify({
      ok: true,
      testedAt: new Date().toISOString(),
      model: backup.model,
      responseLength: trimmed.length,
      preview: trimmed.slice(0, 80),
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
