# Tools

## Model Context Protocol

Maton hosts a remote MCP server at `https://mcp.maton.ai`. It supports both **OAuth** and **API key** (`Authorization: Bearer` header) authentication.

To run a local Maton MCP server using npx (API key auth):

```bash
npx -y @maton/mcp --api-key=YOUR_MATON_API_KEY
```

You can create an API key at https://maton.ai, or set the `MATON_API_KEY` environment variable instead of passing `--api-key`.

For remote (OAuth) usage, point any MCP client that supports remote HTTP servers at `https://mcp.maton.ai`.

See the [MCP package](/tools/modelcontextprotocol) for full setup instructions, Docker usage, and the list of available tools.

## Agent Toolkit

The Maton Agent Toolkit connects popular agent frameworks to the Maton MCP server through function calling. It connects to `https://mcp.maton.ai`, discovers the available tools, and exposes them in each framework's native tool format. Available in TypeScript and Python.

### TypeScript

Supports LangChain, Vercel's AI SDK, OpenAI, and MCP.

```
npm install @maton/agent-toolkit
```

```typescript
import {createMatonAgentToolkit} from '@maton/agent-toolkit/ai-sdk';

const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});

const tools = toolkit.getTools();
// ... use tools ...

await toolkit.close();
```

See the [TypeScript package](/tools/typescript) for LangChain, OpenAI, and MCP usage.

### Python

Supports OpenAI's Agents SDK, LangChain, CrewAI, and Strands.

```
uv pip install maton-agent-toolkit
```

```python
from maton_agent_toolkit.openai.toolkit import create_maton_agent_toolkit

toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
tools = toolkit.get_tools()
# ... use tools ...
await toolkit.close()
```

See the [Python package](/tools/python) for details.

## Available tools

The Maton MCP server exposes a small set of tools for discovering and running automations across 150+ apps:

- `whoami` — show the authenticated Maton user.
- `create_connection`, `delete_connection`, `list_connections`, `get_connection` — manage app connections.
- `search_apps` — discover the supported apps.
- `search_actions`, `get_action`, `run_action` — discover and run pre-built actions.
- `api` — call any external API endpoint through the Maton gateway.
