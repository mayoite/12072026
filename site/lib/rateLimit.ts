export type RateLimitInfo = {
  count: number;
  lastReset: number;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export interface RateLimitBackend {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
}

const MEMORY_MAP_MAX_KEYS = 10_000;
const AI_RATE_LIMIT_KEY_PATTERN =
  /^(ai-advisor|planner-ai-advisor|planner-sketch-to-plan|filter|generate-alt|configurator-smart-wizard|nav-search):/i;

const rateLimitMap = new Map<string, RateLimitInfo>();
let defaultBackendPromise: Promise<RateLimitBackend> | null = null;

export function hasDistributedRateLimit(): boolean {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      (process.env.SUPABASE_URL?.trim() ||
        process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
  );
}

export function isAiScopedRateLimitKey(key: string): boolean {
  return AI_RATE_LIMIT_KEY_PATTERN.test(key);
}

function evictMemoryEntriesIfNeeded(now: number, windowMs: number): void {
  if (rateLimitMap.size <= MEMORY_MAP_MAX_KEYS) return;

  for (const [entryKey, info] of rateLimitMap) {
    if (now - info.lastReset > windowMs) {
      rateLimitMap.delete(entryKey);
    }
  }

  while (rateLimitMap.size > MEMORY_MAP_MAX_KEYS) {
    const oldestKey = rateLimitMap.keys().next().value;
    if (!oldestKey) break;
    rateLimitMap.delete(oldestKey);
  }
}

function applyMemoryRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60000,
): RateLimitResult {
  const now = Date.now();
  evictMemoryEntriesIfNeeded(now, windowMs);

  const info = rateLimitMap.get(key) ?? { count: 0, lastReset: now };

  if (now - info.lastReset > windowMs) {
    info.count = 0;
    info.lastReset = now;
  }

  if (info.count >= limit) {
    return { success: false, limit, remaining: 0, reset: info.lastReset + windowMs };
  }

  info.count += 1;
  rateLimitMap.set(key, info);

  return {
    success: true,
    limit,
    remaining: limit - info.count,
    reset: info.lastReset + windowMs,
  };
}

function memoryRateLimitOrFailClosed(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  if (
    process.env.NODE_ENV === "production" &&
    isAiScopedRateLimitKey(key) &&
    !hasDistributedRateLimit()
  ) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Date.now() + windowMs,
    };
  }

  return applyMemoryRateLimit(key, limit, windowMs);
}

export async function rateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60000,
  backend?: RateLimitBackend,
): Promise<RateLimitResult> {
  if (backend) {
    return backend.check(key, limit, windowMs);
  }

  if (hasDistributedRateLimit()) {
    defaultBackendPromise ??= createSupabaseRateLimitBackend();
    return (await defaultBackendPromise).check(key, limit, windowMs);
  }

  return memoryRateLimitOrFailClosed(key, limit, windowMs);
}

export async function createSupabaseRateLimitBackend(): Promise<RateLimitBackend> {
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      check(key, limit, windowMs) {
        return Promise.resolve(
          memoryRateLimitOrFailClosed(key, limit, windowMs),
        );
      },
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  return {
    async check(key, limit, windowMs) {
      try {
        const now = Date.now();
        const windowStart = now - windowMs;
        const { data, error } = await supabase
          .from("rate_limits")
          .select("count, window_start")
          .eq("key", key)
          .maybeSingle();

        if (error) {
          return memoryRateLimitOrFailClosed(key, limit, windowMs);
        }

        let currentCount = 0;
        let currentWindow = now;

        if (
          data &&
          typeof data.window_start === "number" &&
          data.window_start > windowStart
        ) {
          currentCount = Number(data.count) || 0;
          currentWindow = data.window_start;
        }

        if (currentCount >= limit) {
          return {
            success: false,
            limit,
            remaining: 0,
            reset: currentWindow + windowMs,
          };
        }

        const nextCount = currentCount + 1;
        const { error: upsertError } = await supabase.from("rate_limits").upsert({
          key,
          count: nextCount,
          window_start: currentWindow,
        });

        if (upsertError) {
          return memoryRateLimitOrFailClosed(key, limit, windowMs);
        }

        return {
          success: true,
          limit,
          remaining: limit - nextCount,
          reset: currentWindow + windowMs,
        };
      } catch {
        return memoryRateLimitOrFailClosed(key, limit, windowMs);
      }
    },
  };
}
