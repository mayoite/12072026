import { NextResponse } from "next/server";
import { isDevAuthBypassEnabled } from "@/lib/auth/devAuthBypass";

/**
 * Dev diagnostic — reports whether server-side auth bypass is active.
 * Never returns secrets.
 */
export async function GET() {
  return NextResponse.json({
    bypassEnabled: isDevAuthBypassEnabled(),
    nodeEnv: process.env.NODE_ENV ?? null,
    flagSet: process.env.DEV_AUTH_BYPASS === "1",
  });
}
