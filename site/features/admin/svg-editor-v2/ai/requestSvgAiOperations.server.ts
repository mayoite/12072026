import { requestProviderText, resolveProviderChain } from "@/lib/ai/providerChain";

import { SvgAiRequestV1Schema, SvgAiResponseV1Schema, type SvgAiRequestV1 } from "./svgAiSchemasV1";

export class SvgAiProviderError extends Error {
  constructor(readonly code: "NO_PROVIDER" | "REFUSED" | "MALFORMED" | "EXHAUSTED", message: string) {
    super(message);
    this.name = "SvgAiProviderError";
  }
}

const SYSTEM_PROMPT = `Return one JSON object matching the supplied SVG AI V1 response schema. Return typed operations only. Never return SVG markup, URLs, storage actions, lifecycle actions, or publish actions. Echo the exact base checksum.`;

export async function requestSvgAiOperations(input: SvgAiRequestV1) {
  const request = SvgAiRequestV1Schema.parse(input);
  const ordered = resolveProviderChain();
  if (ordered.length === 0) throw new SvgAiProviderError("NO_PROVIDER", "No structured AI provider is configured");
  const failures: string[] = [];
  for (const provider of ordered) {
    try {
      const text = await requestProviderText(provider, [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(request) },
      ], { temperature: 0 });
      if (/\brefus(?:e|al)\b/i.test(text) && !text.trim().startsWith("{")) {
        throw new SvgAiProviderError("REFUSED", "The provider refused the SVG operation request");
      }
      const parsed: unknown = JSON.parse(text);
      const response = SvgAiResponseV1Schema.parse(parsed);
      if (response.baseChecksum !== request.baseChecksum) throw new Error("Provider returned a stale base checksum");
      return response;
    } catch (error) {
      failures.push(`${provider.provider}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new SvgAiProviderError("EXHAUSTED", `All compatible providers failed: ${failures.join("; ")}`);
}
