import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {RequestHandlerExtra} from '@modelcontextprotocol/sdk/shared/protocol.js';
import {
  Configuration,
  checkConfiguration,
  isToolAllowed,
} from '../shared/configuration';
import MatonAPI from '../shared/api';
import tools from '../shared/tools';

class MatonAgentToolkit extends McpServer {
  private _maton: MatonAPI;

  constructor(configuration: Configuration) {
    super({
      name: 'Maton',
      version: '0.0.1',
    });

    this._maton = new MatonAPI(configuration.apiKey);

    checkConfiguration(configuration);

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        async (arg: any, _extra: RequestHandlerExtra) => {
          const result = await this._maton.run(tool.method, arg);
          return {
            content: [
              {
                type: 'text' as const,
                text: String(result),
              },
            ],
          };
        }
      );
    });
  }
}

export default MatonAgentToolkit;
