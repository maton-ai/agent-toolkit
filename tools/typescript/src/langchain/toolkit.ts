import {z} from 'zod';
import {BaseToolkit, StructuredTool} from '@langchain/core/tools';
import {CallbackManagerForToolRun} from '@langchain/core/callbacks/manager';
import {RunnableConfig} from '@langchain/core/runnables';
import {jsonSchemaToZod} from '../shared/schema-utils';
import {ToolkitCore, ToolkitConfig, McpTool} from '../shared/toolkit-core';
import type {MatonMcpClient} from '../shared/mcp-client';

/**
 * A LangChain StructuredTool that executes Maton operations via MCP.
 */
class MatonTool extends StructuredTool {
  private mcpClient: MatonMcpClient;
  method: string;
  name: string;
  description: string;
  schema: z.ZodObject<any, any, any, any>;

  constructor(
    mcpClient: MatonMcpClient,
    method: string,
    description: string,
    schema: z.ZodObject<any, any, any, any>
  ) {
    super();
    this.mcpClient = mcpClient;
    this.method = method;
    this.name = method;
    this.description = description;
    this.schema = schema;
  }

  _call(
    arg: z.output<typeof this.schema>,
    _runManager?: CallbackManagerForToolRun,
    _parentConfig?: RunnableConfig
  ): Promise<any> {
    return this.mcpClient.callTool(this.method, arg);
  }
}

// Use intersection type to satisfy both ToolkitCore and BaseToolkit
class MatonAgentToolkit
  extends ToolkitCore<MatonTool[]>
  implements BaseToolkit
{
  constructor(config: ToolkitConfig) {
    super(config, []);
  }

  /**
   * The tools available in the toolkit.
   * Required by BaseToolkit interface.
   * @deprecated Access tools via getTools() after calling initialize().
   */
  get tools(): MatonTool[] {
    return this.getToolsWithWarning();
  }

  protected convertTools(mcpTools: McpTool[]): MatonTool[] {
    return mcpTools.map((tool) => {
      const zodSchema = jsonSchemaToZod(tool.inputSchema);
      return new MatonTool(
        this.mcpClient,
        tool.name,
        tool.description || tool.name,
        zodSchema
      );
    });
  }

  close(): Promise<void> {
    return super.close([]);
  }
}

/**
 * Factory function to create and initialize a MatonAgentToolkit.
 */
export async function createMatonAgentToolkit(
  config: ToolkitConfig
): Promise<MatonAgentToolkit> {
  const toolkit = new MatonAgentToolkit(config);
  await toolkit.initialize();
  return toolkit;
}

export default MatonAgentToolkit;
