import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {AsyncInitializer} from './async-initializer';
import {VERSION, MCP_SERVER_URL, TOOLKIT_HEADER, MCP_HEADER} from './constants';

declare const process: {env: {MATON_API_KEY?: string}};

export interface McpClientConfig {
  apiKey?: string;
  context?: {
    connection?: string;
  };
  mode?: 'modelcontextprotocol' | 'toolkit';
}

export interface McpTool {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export interface McpToolCallResult {
  content: Array<{type: string; text?: string}>;
  isError?: boolean;
}

export class MatonMcpClient {
  private client: Client | null = null;
  private transport: StreamableHTTPClientTransport | null = null;
  private tools: McpTool[] = [];
  private apiKey: string;
  private config: McpClientConfig;
  private initializer = new AsyncInitializer();

  constructor(config: McpClientConfig) {
    this.config = config;
    this.apiKey = this.resolveKey(config.apiKey);
  }

  /**
   * Create transport and client fresh for each connection attempt.
   */
  private createTransportAndClient(): {
    transport: StreamableHTTPClientTransport;
    client: Client;
  } {
    // Determine User-Agent based on mode
    const userAgent =
      this.config.mode === 'modelcontextprotocol'
        ? `${MCP_HEADER}/${VERSION}`
        : `${TOOLKIT_HEADER}/${VERSION}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      'User-Agent': userAgent,
    };

    if (this.config.context?.connection) {
      headers['Maton-Connection'] = this.config.context.connection;
    }

    const transport = new StreamableHTTPClientTransport(
      new URL(MCP_SERVER_URL),
      {requestInit: {headers}}
    );

    const client = new Client(
      {
        name: TOOLKIT_HEADER,
        version: VERSION,
      },
      {
        capabilities: {},
      }
    );

    return {transport, client};
  }

  private resolveKey(key?: string): string {
    const apiKey = key || process.env.MATON_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      throw new Error(
        'Maton API key is required. Pass it as `apiKey` or set the MATON_API_KEY environment variable. Create one at https://maton.ai.'
      );
    }
    return apiKey;
  }

  connect(): Promise<void> {
    return this.initializer.initialize(() => this.doConnect());
  }

  private async doConnect(): Promise<void> {
    try {
      // Create transport and client fresh for each connection attempt
      const {transport, client} = this.createTransportAndClient();
      this.transport = transport;
      this.client = client;

      await this.client.connect(this.transport);
      const result = await this.client.listTools();
      this.tools = result.tools as McpTool[];
    } catch (error) {
      // Clean up on failure
      this.client = null;
      this.transport = null;

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to connect to Maton MCP server at ${MCP_SERVER_URL}. ` +
          `Error: ${errorMessage}`,
        {cause: error}
      );
    }
  }

  isConnected(): boolean {
    return this.initializer.isInitialized;
  }

  getTools(): McpTool[] {
    if (!this.initializer.isInitialized) {
      throw new Error(
        'MCP client not connected. Call connect() before accessing tools.'
      );
    }
    return this.tools;
  }

  async callTool(
    name: string,
    args: Record<string, unknown>,
    options?: {connection?: string}
  ): Promise<string> {
    if (!this.initializer.isInitialized || !this.client) {
      throw new Error(
        'MCP client not connected. Call connect() before calling tools.'
      );
    }

    // Connection priority: per-call override > connection-time context > none.
    // When a connection is supplied, forward it as a `connection` argument so
    // the server routes the call through it (mirrors the Maton-Connection header).
    const connection = options?.connection ?? this.config.context?.connection;

    if (connection && args.connection && args.connection !== connection) {
      console.warn(
        `[Maton Agent Toolkit] Connection context conflict detected:\n` +
          `  - Tool args.connection: ${args.connection}\n` +
          `  - Override connection: ${connection}\n` +
          `  Using override connection. This may indicate a bug in your code.`
      );
    }

    const finalArgs = connection ? {...args, connection} : args;

    try {
      const result = (await this.client.callTool({
        name,
        arguments: finalArgs,
      })) as McpToolCallResult;

      if (result.isError) {
        const errorText = result.content?.find((c) => c.type === 'text')?.text;
        throw new Error(errorText || 'Tool execution failed');
      }

      const textContent = result.content?.find((c) => c.type === 'text');
      if (textContent && textContent.text) {
        return textContent.text;
      }

      return JSON.stringify(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to execute tool '${name}': ${errorMessage}`, {
        cause: error,
      });
    }
  }

  /**
   * Disconnect from the MCP server and clean up resources.
   * Safe to call multiple times (idempotent).
   */
  async disconnect(): Promise<void> {
    if (!this.initializer.isInitialized) {
      return; // Already disconnected or never connected
    }

    try {
      if (this.client) {
        await this.client.close();
      }
    } finally {
      // Always clean up state, even if close() throws
      this.client = null;
      this.transport = null;
      this.tools = [];
      this.initializer.reset();
    }
  }
}

export default MatonMcpClient;
