# Maton Agent Toolkit - TypeScript

The Maton Agent Toolkit connects popular agent frameworks — LangChain, Vercel's AI SDK, and OpenAI — to the [Maton MCP server](https://mcp.maton.ai) through function calling. Instead of bundling a fixed set of actions, the toolkit connects to the remote Maton MCP server, discovers the available tools, and exposes them in each framework's native tool format. This lets your agent connect and automate 150+ apps (Google Workspace, Microsoft 365, GitHub, Notion, Slack, HubSpot, and more).

## Installation

You don't need this source code unless you want to modify the package. If you just want to use the package run:

```
npm install @maton/agent-toolkit
```

### Requirements

- Node 18+

## Usage

The library needs to be configured with your Maton API key. You can create one at [maton.ai](https://maton.ai), or set the `MATON_API_KEY` environment variable. The toolkit connects to `https://mcp.maton.ai` with your key in the `Authorization: Bearer` header.

Each integration exposes an async factory (`createMatonAgentToolkit`) that connects to the MCP server and fetches tools. Always `close()` the toolkit when you're done to release the connection.

### Vercel AI SDK

```typescript
import {createMatonAgentToolkit} from '@maton/agent-toolkit/ai-sdk';

const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});

const tools = toolkit.getTools();
// ... use tools with generateText / streamText ...

await toolkit.close();
```

### LangChain

```typescript
import {createMatonAgentToolkit} from '@maton/agent-toolkit/langchain';

const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});

const tools = toolkit.getTools();
// ... pass tools to your LangChain agent ...

await toolkit.close();
```

### OpenAI

```typescript
import {createMatonAgentToolkit} from '@maton/agent-toolkit/openai';

const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});

const tools = toolkit.getTools();
// ... pass tools to chat.completions.create ...
// then handle tool calls:
// const toolMessage = await toolkit.handleToolCall(toolCall);

await toolkit.close();
```

### Model Context Protocol

The toolkit also exposes a local MCP server that proxies to the remote Maton MCP server:

```typescript
import {createMatonAgentToolkit} from '@maton/agent-toolkit/modelcontextprotocol';

const server = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});

// `server` is an McpServer instance ready to connect to a transport.
```

#### Context

You can provide a default `connection` that all requests route through (sent as the `Maton-Connection` header). If omitted, Maton uses the newest active connection for the target app.

```typescript
const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {
    context: {
      connection: 'conn_123',
    },
  },
});
```

## Available tools

The toolkit exposes whatever tools the Maton MCP server provides, including `whoami`, connection management (`create_connection`, `list_connections`, …), discovery (`search_apps`, `search_actions`, `get_action`), `run_action`, and the generic `api` gateway passthrough.

See the [Maton MCP package](/tools/modelcontextprotocol) for details.
