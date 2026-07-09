import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {RequestHandlerExtra} from '@modelcontextprotocol/sdk/shared/protocol.js';
import {Configuration} from '../shared/configuration';
import {MatonMcpClient, McpTool} from '../shared/mcp-client';
import {jsonSchemaToZodShape} from '../shared/schema-utils';
import {AsyncInitializer} from '../shared/async-initializer';
import {VERSION} from '../shared/constants';

export interface McpToolkitConfig {
  apiKey?: string;
  configuration: Configuration;
}

class MatonAgentToolkit extends McpServer {
  private _mcpClient: MatonMcpClient;
  private _configuration: Configuration;
  private _initializer = new AsyncInitializer();

  constructor({apiKey, configuration}: McpToolkitConfig) {
    super({
      name: 'Maton',
      version: VERSION,
    });

    this._configuration = configuration;

    // MCP client for connecting to mcp.maton.ai
    this._mcpClient = new MatonMcpClient({
      apiKey,
      context: {
        connection: configuration.context?.connection,
      },
      mode: configuration.context?.mode,
    });
  }

  /**
   * Initialize the toolkit by connecting to mcp.maton.ai and registering tools.
   * Must be called after construction and before the server starts handling requests.
   */
  initialize(): Promise<void> {
    return this._initializer.initialize(() => this.doInitialize());
  }

  private async doInitialize(): Promise<void> {
    await this._mcpClient.connect();

    // Get tools from remote MCP and register as local proxies
    const remoteTools = this._mcpClient.getTools();

    for (const remoteTool of remoteTools) {
      this.registerProxyTool(remoteTool);
    }
  }

  /**
   * Register a tool that proxies execution to mcp.maton.ai
   */
  private registerProxyTool(remoteTool: McpTool): void {
    // Convert JSON Schema to Zod shape for MCP SDK tool registration
    // This properly handles the 'required' field and type validation
    const zodShape = jsonSchemaToZodShape(remoteTool.inputSchema);

    this.tool(
      remoteTool.name,
      remoteTool.description || remoteTool.name,
      zodShape,
      async (
        args: Record<string, unknown>,
        _extra: RequestHandlerExtra<any, any>
      ) => {
        try {
          // If args.connection exists, pass it as an override to callTool
          // callTool will handle fallback to connection-time context
          const options = args.connection
            ? {connection: args.connection as string}
            : undefined;

          const result = await this._mcpClient.callTool(
            remoteTool.name,
            args,
            options
          );
          return {
            content: [
              {
                type: 'text' as const,
                text: result,
              },
            ],
          };
        } catch (error) {
          // Re-throw for proper MCP error propagation
          if (error instanceof Error) {
            throw error;
          }
          throw new Error(String(error));
        }
      }
    );
  }

  /**
   * Check if the toolkit has been initialized.
   */
  isInitialized(): boolean {
    return this._initializer.isInitialized;
  }

  /**
   * Close the MCP client connection and clean up resources.
   * Safe to call multiple times (idempotent).
   */
  async close(): Promise<void> {
    if (!this._initializer.isInitialized) {
      return; // Already closed or never initialized
    }

    await this._mcpClient.disconnect();
    this._initializer.reset();
  }
}

/**
 * Factory function to create and initialize a MatonAgentToolkit.
 * Provides a simpler async initialization pattern.
 *
 * @example
 * const toolkit = await createMatonAgentToolkit({
 *   apiKey: 'YOUR_MATON_API_KEY',
 *   configuration: {}
 * });
 * // toolkit is now ready to use as an MCP server
 */
export async function createMatonAgentToolkit(
  config: McpToolkitConfig
): Promise<MatonAgentToolkit> {
  const toolkit = new MatonAgentToolkit(config);
  await toolkit.initialize();
  return toolkit;
}

export default MatonAgentToolkit;
