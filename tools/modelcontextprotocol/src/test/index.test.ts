import {parseArgs, validateApiKey, buildHeaders} from '../cli';
import {extractClientName, buildUserAgent} from '../userAgent';

describe('extractClientName', () => {
  it('should extract client name from a valid initialize request', () => {
    const message = {
      jsonrpc: '2.0' as const,
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'cursor',
          version: '1.0.0',
        },
      },
    };
    expect(extractClientName(message)).toBe('cursor');
  });

  it('should extract client name from Claude Desktop initialize request', () => {
    const message = {
      jsonrpc: '2.0' as const,
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'claude-ai',
          version: '0.1.0',
        },
      },
    };
    expect(extractClientName(message)).toBe('claude-ai');
  });

  it('should return undefined for non-initialize messages', () => {
    const message = {
      jsonrpc: '2.0' as const,
      id: 1,
      method: 'tools/list',
      params: {},
    };
    expect(extractClientName(message)).toBeUndefined();
  });

  it('should return undefined when clientInfo is missing', () => {
    const message = {
      jsonrpc: '2.0' as const,
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
      },
    };
    expect(extractClientName(message)).toBeUndefined();
  });

  it('should return undefined for response messages', () => {
    const message = {
      jsonrpc: '2.0' as const,
      id: 0,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo: {name: 'Maton', version: '0.4.0'},
      },
    };
    expect(extractClientName(message)).toBeUndefined();
  });

  it('should return undefined for notification messages', () => {
    const message = {
      jsonrpc: '2.0' as const,
      method: 'notifications/initialized',
    };
    expect(extractClientName(message)).toBeUndefined();
  });
});

describe('buildUserAgent', () => {
  it('should append client name in parentheses when provided', () => {
    expect(buildUserAgent('cursor')).toMatch(
      /^maton-mcp-local\/[\d.]+ \(cursor\)$/
    );
  });

  it('should return base user agent when no client name provided', () => {
    expect(buildUserAgent()).toMatch(/^maton-mcp-local\/[\d.]+$/);
  });

  it('should return base user agent when client name is undefined', () => {
    expect(buildUserAgent(undefined)).toMatch(/^maton-mcp-local\/[\d.]+$/);
  });
});

describe('parseArgs function', () => {
  const originalEnv = process.env.MATON_API_KEY;

  beforeEach(() => {
    delete process.env.MATON_API_KEY;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.MATON_API_KEY = originalEnv;
    } else {
      delete process.env.MATON_API_KEY;
    }
  });

  describe('success cases', () => {
    it('should parse api-key and connection arguments correctly', () => {
      const args = ['--api-key=maton_test_123', '--connection=conn_123'];
      const options = parseArgs(args);
      expect(options.apiKey).toBe('maton_test_123');
      expect(options.connection).toBe('conn_123');
    });

    it('should parse api-key argument correctly', () => {
      const args = ['--api-key=maton_test_123'];
      const options = parseArgs(args);
      expect(options.apiKey).toBe('maton_test_123');
    });

    it('if api key set in env variable, should use it', () => {
      process.env.MATON_API_KEY = 'maton_test_123';
      const args: string[] = [];
      const options = parseArgs(args);
      expect(options.apiKey).toBe('maton_test_123');
    });

    it('if api key set in env variable but also passed into args, should prefer args key', () => {
      process.env.MATON_API_KEY = 'maton_test_123';
      const args = ['--api-key=maton_test_456'];
      const options = parseArgs(args);
      expect(options.apiKey).toBe('maton_test_456');
    });

    it('ignore all arguments not prefixed with --', () => {
      const args = ['--api-key=maton_test_123', 'connection=conn_123'];
      const options = parseArgs(args);
      expect(options.apiKey).toBe('maton_test_123');
      expect(options.connection).toBeUndefined();
    });
  });

  describe('error cases', () => {
    it('should throw an error if api-key is not provided', () => {
      const args: string[] = [];
      expect(() => parseArgs(args)).toThrow(
        'Maton API key not provided. Please either pass it as an argument --api-key=$KEY or set the MATON_API_KEY environment variable. Create one at https://maton.ai.'
      );
    });

    it('should throw an error if an invalid argument is provided', () => {
      const args = ['--invalid-arg=value', '--api-key=maton_test_123'];
      expect(() => parseArgs(args)).toThrow(
        'Invalid argument: invalid-arg. Accepted arguments are: api-key, connection'
      );
    });
  });
});

describe('validateApiKey', () => {
  it('should accept a non-empty key', () => {
    expect(() => validateApiKey('maton_test_123')).not.toThrow();
  });

  it('should reject empty keys', () => {
    expect(() => validateApiKey('')).toThrow('Invalid API key');
  });

  it('should reject whitespace-only keys', () => {
    expect(() => validateApiKey('   ')).toThrow('Invalid API key');
  });
});

describe('buildHeaders', () => {
  it('should set the Authorization bearer header', () => {
    const headers = buildHeaders(
      {apiKey: 'maton_test_123'},
      'maton-mcp-local/0.0.0'
    );
    expect(headers.Authorization).toBe('Bearer maton_test_123');
    expect(headers['User-Agent']).toBe('maton-mcp-local/0.0.0');
    expect(headers['Maton-Connection']).toBeUndefined();
  });

  it('should set the Maton-Connection header when a connection is provided', () => {
    const headers = buildHeaders(
      {apiKey: 'maton_test_123', connection: 'conn_123'},
      'maton-mcp-local/0.0.0'
    );
    expect(headers['Maton-Connection']).toBe('conn_123');
  });
});
