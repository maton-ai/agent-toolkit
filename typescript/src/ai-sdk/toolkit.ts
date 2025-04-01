import MatonAPI from '../shared/api';
import tools from '../shared/tools';
import {
  checkConfiguration,
  isToolAllowed,
  type Configuration,
} from '../shared/configuration';
import type {CoreTool} from 'ai';
import MatonTool from './tool';

class MatonAgentToolkit {
  private _maton: MatonAPI;

  tools: {[key: string]: CoreTool};

  constructor(configuration: Configuration) {
    this._maton = new MatonAPI(configuration.apiKey);
    this.tools = {};

    checkConfiguration(configuration);

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    filteredTools.forEach((tool) => {
      // @ts-ignore
      this.tools[tool.method] = MatonTool(
        this._maton,
        tool.method,
        tool.description,
        tool.parameters
      );
    });
  }

  getTools(): {[key: string]: CoreTool} {
    return this.tools;
  }
}

export default MatonAgentToolkit;
