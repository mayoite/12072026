import { describe, it, expect, vi, beforeEach } from 'vitest';
import type * as providerChainType0 from "@/lib/ai/providerChain";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
  };
});

// Mock env.server
vi.mock('@/lib/env.server', () => ({
  env: {
    OPENAI_API_KEY: 'openai-key',
    OPENROUTER_API_KEY_PRIMARY: 'primary-key',
    OPENROUTER_API_KEY_BACKUP: 'backup-key',
    OPENROUTER_MODEL: 'test-model',
    GEMINI_API_KEY: 'gemini-key',
    GEMINI_MODEL: 'gemini-model',
  },
}));

// Mock siteUrl
vi.mock('@/lib/siteUrl', () => ({
  SITE_URL: 'https://test-site.com',
}));

describe('providerChain', () => {
  let providerChain: typeof providerChainType0;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    providerChain = await import('@/lib/ai/providerChain');
  });

  it('should return correct Bedrock url', () => {
    expect(providerChain.getBedrockMantleBaseUrl('us-east-1')).toBe(
      'https://bedrock-mantle.us-east-1.api.aws/v1'
    );
  });

  it('should resolve provider chain from environment keys', () => {
    const chain = providerChain.resolveProviderChain();
    expect(chain).toHaveLength(3);
    expect(chain[0]).toEqual({
      provider: 'gemini',
      apiKey: 'gemini-key',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      model: 'gemini-model',
    });
    expect(chain[1]).toEqual({
      provider: 'openrouter',
      apiKey: 'primary-key',
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://test-site.com',
        'X-Title': 'One&Only',
      },
      model: 'test-model',
    });
    expect(chain[2].apiKey).toBe('backup-key');
  });

  it('should request OpenAI compatible text successfully (non-streaming)', async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Hello, visual designer!',
          },
        },
      ],
    });

    const provider = providerChain.resolveProviderChain()[1];
    const res = await providerChain.requestProviderText(
      provider,
      [{ role: 'user', content: 'hi' }],
      { temperature: 0.7 }
    );

    expect(res).toBe('Hello, visual designer!');
    expect(mockCreate).toHaveBeenCalledWith(
      {
        model: 'test-model',
        messages: [{ role: 'user', content: 'hi' }],
        temperature: 0.7,
      },
      {
        signal: undefined,
      }
    );
  });

  it('should request Gemini text successfully (non-streaming)', async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Hello, I am Gemini!',
          },
        },
      ],
    });

    const provider = providerChain.resolveProviderChain()[0];
    const res = await providerChain.requestProviderText(
      provider,
      [{ role: 'user', content: 'hi' }],
      { temperature: 0.7 }
    );

    expect(res).toBe('Hello, I am Gemini!');
    expect(mockCreate).toHaveBeenCalledWith(
      {
        model: 'gemini-model',
        messages: [{ role: 'user', content: 'hi' }],
        temperature: 0.7,
      },
      {
        signal: undefined,
      }
    );
  });

  it('should support array contents in response extraction', async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: [
              'Part 1 ',
              { type: 'text', text: 'Part 2' },
              null,
              { type: 'image' }, // ignored
            ],
          },
        },
      ],
    });

    const provider = providerChain.resolveProviderChain()[1];
    const res = await providerChain.requestProviderText(provider, []);
    expect(res).toBe('Part 1 Part 2');
  });

  it('should request OpenAI compatible text successfully (streaming)', async () => {
    const mockAsyncIterable = {
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: 'streaming' } }] };
        yield { choices: [{ delta: { content: ' ' } }] };
        yield { choices: [{ delta: { content: 'chunk' } }] };
      },
    };
    mockCreate.mockResolvedValue(mockAsyncIterable);

    const provider = providerChain.resolveProviderChain()[1];
    const deltaCallback = vi.fn();

    const res = await providerChain.requestProviderText(
      provider,
      [],
      { stream: true, onDelta: deltaCallback }
    );

    expect(res).toBe('streaming chunk');
    expect(deltaCallback).toHaveBeenCalledTimes(3);
    expect(deltaCallback).toHaveBeenNthCalledWith(1, 'streaming');
    expect(deltaCallback).toHaveBeenNthCalledWith(2, ' ');
    expect(deltaCallback).toHaveBeenNthCalledWith(3, 'chunk');
  });
});
