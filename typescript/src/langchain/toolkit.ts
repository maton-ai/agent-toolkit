import {BaseToolkit} from '@langchain/core/tools';
import MatonTool from './tool';
import MatonAPI from '../shared/api';
import tools from '../shared/tools';
import {isToolAllowed, type Configuration} from '../shared/configuration';

class MatonAgentToolkit implements BaseToolkit {
  private _maton: MatonAPI;

  tools: MatonTool[];

  constructor(configuration: Configuration) {
    this._maton = new MatonAPI(configuration.apiKey);

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    this.tools = filteredTools.map(
      (tool) =>
        new MatonTool(
          this._maton,
          tool.method,
          tool.description,
          tool.parameters
        )
    );
  }

  getTools(): MatonTool[] {
    return this.tools;
  }
}

export default MatonAgentToolkit;
