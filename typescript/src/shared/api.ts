import type {Context} from './configuration';

class MatonClient {
  private headers: {'x-api-key': string};

  constructor(apiKey: string) {
    this.headers = {'x-api-key': apiKey};
  }

  async createConnection(app: string): Promise<any> {
    const body = {app};
    const response = await fetch('https://api.maton.ai/create-connection', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async getConnection(connectionId: string): Promise<any> {
    const body = {connection_id: connectionId};
    const response = await fetch('https://api.maton.ai/get-connection', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async listConnections(app?: string, status?: string): Promise<any> {
    const body = {app, status};
    const response = await fetch('https://api.maton.ai/list-connections', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async deleteConnection(connectionId: string): Promise<any> {
    const body = {connection_id: connectionId};
    const response = await fetch('https://api.maton.ai/delete-connection', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async invokeAction(
    app: string,
    action: string,
    args: {[key: string]: any}
  ): Promise<any> {
    const body = {
      app: app,
      action: action,
      args: args,
    };
    const response = await fetch('https://api.maton.ai/invoke-action', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return response.json();
  }

  async invokeAgent(app: string, userPrompt: string): Promise<any> {
    const body = {
      app: app,
      user_prompt: userPrompt,
    };
    const response = await fetch('https://api.maton.ai/invoke-agent', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return response.json();
  }
}

class MatonAPI {
  maton: MatonClient;

  context: Context;

  constructor(apiKey: string, context?: Context) {
    const matonClient = new MatonClient(apiKey);
    this.maton = matonClient;
    this.context = context || {};
  }

  async run(method: string, arg: any) {
    const [app, ...rest] = method.split('_');
    const action = rest.join('-');

    let output = {};
    if (method.endsWith('check_connection')) {
      const listConnectionsResp = await this.maton.listConnections(
        app,
        'ACTIVE'
      );
      const connections = listConnectionsResp.connections;
      return connections && connections.length > 0;
    } else if (method.endsWith('start_connection')) {
      const createConnectionResp = await this.maton.createConnection(app);
      const getConnectionResp = await this.maton.getConnection(
        createConnectionResp.connection_id
      );
      const connection = getConnectionResp.connection;
      if (connection) {
        output = {
          connection_id: connection.connection_id,
          redirect_url: connection.url,
          instruction:
            'Ask user to open the redirect URL and complete the Oauth process. \n                    Once user completes the process and gets back, check again by calling check_connection',
        };
      }
    } else if (method.endsWith('transfer_agent')) {
      output = await this.maton.invokeAgent(app, arg.user_prompt);
    } else {
      output = await this.maton.invokeAction(app, action, arg);
    }

    return JSON.stringify(output);
  }
}

export default MatonAPI;
