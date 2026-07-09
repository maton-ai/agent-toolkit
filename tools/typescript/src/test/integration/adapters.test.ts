import type {McpTool} from '../../shared/mcp-client';

const REMOTE_TOOLS: McpTool[] = [
  {
    name: 'create_contact',
    description: 'Create a CRM contact',
    inputSchema: {
      type: 'object',
      properties: {
        email: {type: 'string', description: 'Contact email'},
        age: {type: 'number'},
        status: {type: 'string', enum: ['active', 'inactive']},
        tags: {type: 'array', items: {type: 'string'}},
      },
      required: ['email'],
    },
  },
];

const CALL_RESULT = 'ok: contact created';

const callToolMock = jest.fn().mockResolvedValue(CALL_RESULT);

jest.mock('../../shared/mcp-client', () => {
  const actual = jest.requireActual('../../shared/mcp-client');
  return {
    ...actual,
    MatonMcpClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      getTools: () => REMOTE_TOOLS,
      callTool: callToolMock,
    })),
  };
});

jest.mock('ai', () => ({
  tool: (config: unknown) => config,
}));

const config = {apiKey: 'test-key', configuration: {}};

beforeEach(() => {
  callToolMock.mockClear();
});

describe('ai-sdk adapter', () => {
  it('converts MCP tools into ai-sdk tools that execute via the MCP client', async () => {
    const {createMatonAgentToolkit} = await import('../../ai-sdk/toolkit');
    const toolkit = await createMatonAgentToolkit(config);

    const tools = toolkit.getTools();
    expect(Object.keys(tools)).toEqual(['create_contact']);

    const tool = tools.create_contact as {
      description: string;
      inputSchema: unknown;
      execute: (args: unknown) => Promise<unknown>;
    };
    expect(tool.description).toBe('Create a CRM contact');
    expect(tool.inputSchema).toBeDefined();

    const args = {email: 'a@b.com', status: 'active'};
    const result = await tool.execute(args);
    expect(result).toBe(CALL_RESULT);
    expect(callToolMock).toHaveBeenCalledWith('create_contact', args);

    await toolkit.close();
  });
});

describe('langchain adapter', () => {
  it('converts MCP tools into StructuredTools that invoke via the MCP client', async () => {
    const {createMatonAgentToolkit} = await import('../../langchain/toolkit');
    const toolkit = await createMatonAgentToolkit(config);

    const tools = toolkit.getTools();
    expect(tools).toHaveLength(1);

    const tool = tools[0];
    expect(tool.name).toBe('create_contact');
    expect(tool.description).toBe('Create a CRM contact');
    expect(tool.schema).toBeDefined();

    const args = {email: 'a@b.com', tags: ['vip']};
    const result = await tool.invoke(args);
    expect(result).toBe(CALL_RESULT);
    expect(callToolMock).toHaveBeenCalledWith('create_contact', args);

    await toolkit.close();
  });
});

describe('openai adapter', () => {
  it('converts MCP tools into ChatCompletion function tools', async () => {
    const {createMatonAgentToolkit} = await import('../../openai/toolkit');
    const toolkit = await createMatonAgentToolkit(config);

    const tools = toolkit.getTools();
    expect(tools).toHaveLength(1);

    const tool = tools[0];
    if (tool.type !== 'function') {
      throw new Error('expected a function tool');
    }
    expect(tool.function.name).toBe('create_contact');
    expect(tool.function.parameters).toMatchObject({type: 'object'});

    await toolkit.close();
  });

  it('handleToolCall executes a function tool call and returns a tool message', async () => {
    const {createMatonAgentToolkit} = await import('../../openai/toolkit');
    const toolkit = await createMatonAgentToolkit(config);

    const message = await toolkit.handleToolCall({
      id: 'call_1',
      type: 'function',
      function: {
        name: 'create_contact',
        arguments: JSON.stringify({email: 'a@b.com'}),
      },
    });

    expect(message).toMatchObject({
      role: 'tool',
      tool_call_id: 'call_1',
      content: CALL_RESULT,
    });
    expect(callToolMock).toHaveBeenCalledWith('create_contact', {
      email: 'a@b.com',
    });

    await toolkit.close();
  });

  it('handleToolCall rejects non-function (custom) tool calls', async () => {
    const {createMatonAgentToolkit} = await import('../../openai/toolkit');
    const toolkit = await createMatonAgentToolkit(config);

    await expect(
      toolkit.handleToolCall({
        id: 'call_2',
        type: 'custom',
        custom: {name: 'create_contact', input: '{}'},
      })
    ).rejects.toThrow('Unsupported tool call type');

    await toolkit.close();
  });
});
