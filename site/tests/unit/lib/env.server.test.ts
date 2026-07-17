import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('env.server', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.resetModules();
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should read valid environment variables', async () => {
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.OPENROUTER_API_KEY_PRIMARY = 'test-openrouter-key';
    process.env.OPENROUTER_API_KEY_BACKUP = '';
    process.env.OPENROUTER_MODEL = 'test-model';
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.GEMINI_MODEL = 'test-gemini-model';

    const { env } = await import('../../../lib/env.server');

    expect(env.OPENAI_API_KEY).toBe('test-openai-key');
    expect(env.OPENROUTER_API_KEY_PRIMARY).toBe('test-openrouter-key');
    expect(env.OPENROUTER_API_KEY_BACKUP).toBeUndefined();
    expect(env.OPENROUTER_MODEL).toBe('test-model');
    expect(env.GEMINI_API_KEY).toBe('test-gemini-key');
    expect(env.GEMINI_MODEL).toBe('test-gemini-model');
  });

  it('should throw an error and console.error when environment validation fails', async () => {
    // Force Zod validation failure by passing a non-string or we can use another trick.
    // Zod's safeParse will validate the object. Let's set process.env to something invalid.
    // E.g. we can set OPENAI_API_KEY to an array or another type that doesn't parse as string
    process.env.OPENAI_API_KEY = [] as unknown as string;

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { env } = await import('../../../lib/env.server');

    expect(() => env.OPENAI_API_KEY).toThrow('Invalid server environment variables');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
