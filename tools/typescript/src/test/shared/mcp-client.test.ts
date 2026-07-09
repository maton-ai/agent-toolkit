import {MatonMcpClient} from '@/shared/mcp-client';

// Mock the MCP SDK
jest.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    listTools: jest.fn().mockResolvedValue({
      tools: [
        {
          name: 'search_apps',
          description: 'Search supported apps',
          inputSchema: {
            type: 'object',
            properties: {
              pattern: {type: 'string', description: 'Search pattern'},
            },
            required: [],
          },
        },
        {
          name: 'run_action',
          description: 'Run a pre-built action',
          inputSchema: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              args: {type: 'object'},
            },
            required: ['id'],
          },
        },
      ],
    }),
    callTool: jest.fn().mockResolvedValue({
      content: [{type: 'text', text: '{"ok": true}'}],
    }),
    close: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('@modelcontextprotocol/sdk/client/streamableHttp.js', () => ({
  StreamableHTTPClientTransport: jest.fn().mockImplementation(() => ({})),
}));

describe('MatonMcpClient', () => {
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
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw if no API key is provided', () => {
      expect(() => new MatonMcpClient({apiKey: ''})).toThrow(
        'Maton API key is required'
      );
    });

    it('should throw for whitespace-only API key', () => {
      expect(() => new MatonMcpClient({apiKey: '   '})).toThrow(
        'Maton API key is required'
      );
    });

    it('should accept a non-empty key', () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});
      expect(client).toBeDefined();
    });

    it('should fall back to the MATON_API_KEY environment variable', () => {
      process.env.MATON_API_KEY = 'maton_env_123';
      const client = new MatonMcpClient({});
      expect(client).toBeDefined();
    });
  });

  describe('connect', () => {
    it('should connect and fetch tools', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});

      expect(client.isConnected()).toBe(false);

      await client.connect();

      expect(client.isConnected()).toBe(true);
      const tools = client.getTools();
      expect(tools).toHaveLength(2);
      expect(tools[0].name).toBe('search_apps');
    });

    it('should not reconnect if already connected', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});

      await client.connect();
      await client.connect(); // Should not throw or call connect again

      expect(client.isConnected()).toBe(true);
    });

    it('should handle concurrent connect calls safely', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});

      const results = await Promise.all([
        client.connect(),
        client.connect(),
        client.connect(),
      ]);

      expect(results).toHaveLength(3);
      expect(client.isConnected()).toBe(true);
    });
  });

  describe('getTools', () => {
    it('should throw if not connected', () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});

      expect(() => client.getTools()).toThrow(
        'MCP client not connected. Call connect() before accessing tools.'
      );
    });

    it('should return tools after connection', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});
      await client.connect();

      const tools = client.getTools();
      expect(tools).toBeDefined();
      expect(Array.isArray(tools)).toBe(true);
    });
  });

  describe('callTool', () => {
    it('should throw if not connected', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});

      await expect(
        client.callTool('search_apps', {pattern: 'mail'})
      ).rejects.toThrow(
        'MCP client not connected. Call connect() before calling tools.'
      );
    });

    it('should call tool and return result', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});
      await client.connect();

      const result = await client.callTool('search_apps', {pattern: 'mail'});

      expect(result).toBe('{"ok": true}');
    });
  });

  describe('disconnect', () => {
    it('should disconnect and clear state', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});
      await client.connect();

      expect(client.isConnected()).toBe(true);

      await client.disconnect();

      expect(client.isConnected()).toBe(false);
      expect(() => client.getTools()).toThrow('MCP client not connected');
    });

    it('should be safe to call disconnect when not connected', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});

      await client.disconnect();

      expect(client.isConnected()).toBe(false);
    });

    it('should allow reconnection after disconnect', async () => {
      const client = new MatonMcpClient({apiKey: 'maton_test_123'});

      await client.connect();
      expect(client.isConnected()).toBe(true);

      await client.disconnect();
      expect(client.isConnected()).toBe(false);

      await client.connect();
      expect(client.isConnected()).toBe(true);
    });
  });

  describe('context handling', () => {
    it('should pass connection context in headers', async () => {
      const {
        StreamableHTTPClientTransport,
      } = require('@modelcontextprotocol/sdk/client/streamableHttp.js');

      const client = new MatonMcpClient({
        apiKey: 'maton_test_123',
        context: {connection: 'conn_123'},
      });

      // Transport is created at connect time, not constructor time
      await client.connect();

      expect(StreamableHTTPClientTransport).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          requestInit: expect.objectContaining({
            headers: expect.objectContaining({
              'Maton-Connection': 'conn_123',
              Authorization: 'Bearer maton_test_123',
            }),
          }),
        })
      );
    });
  });
});
