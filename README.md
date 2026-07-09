# Maton Agent Toolkit

This repo helps you connect AI agents to [Maton](https://maton.ai), which allows you to connect and automate 150+ apps (Google Workspace, Microsoft 365, GitHub, Notion, Slack, Airtable, HubSpot, and more) through a unified API.

## Model Context Protocol (MCP)

Maton hosts a remote MCP server at `https://mcp.maton.ai`. It supports both **OAuth** and **API key** (`Authorization: Bearer` header) authentication, so you can connect securely from any MCP client.

- **Remote (OAuth):** point your MCP client at `https://mcp.maton.ai` and complete the OAuth flow in the browser.
- **Local (API key):** run the local proxy with `npx -y @maton/mcp --api-key=YOUR_MATON_API_KEY`.

See the [MCP package](/tools/modelcontextprotocol) for setup instructions, Docker usage, and the full list of tools.

## Agent Toolkit

The Maton Agent Toolkit connects popular agent frameworks to the Maton MCP server through function calling. It discovers the tools available on `https://mcp.maton.ai` and exposes them in each framework's native format.

- **TypeScript** ([`@maton/agent-toolkit`](/tools/typescript)) — LangChain, Vercel's AI SDK, OpenAI, MCP.
- **Python** ([`maton-agent-toolkit`](/tools/python)) — OpenAI Agents SDK, LangChain, CrewAI, Strands.

```bash
npm install @maton/agent-toolkit      # TypeScript
uv pip install maton-agent-toolkit    # Python
```

## Plugins

We ship plugins for popular agent harnesses that wire up the Maton MCP server for you. Each plugin registers the remote server at `https://mcp.maton.ai`, so once installed the Maton tools are available and you complete the OAuth flow in your browser on first use.

### Claude Code

Add this repo as a plugin marketplace, then install the Maton plugin:

```bash
claude plugin marketplace add maton-ai/maton-agent-toolkit
claude plugin install maton@maton-plugins
```

### Cursor

Install the Maton plugin directly from this repo:

```bash
/add-plugin maton-ai/maton-agent-toolkit
```

### Codex

Add this repo as a plugin marketplace, then install the Maton plugin:

```bash
codex plugin marketplace add maton-ai/maton-agent-toolkit
codex plugin add maton@maton-plugins
```

### Gemini CLI

1. Install [Gemini CLI](https://google-gemini.github.io/gemini-cli/#-installation).
2. Install the Maton MCP extension: `gemini extensions install https://github.com/maton-ai/maton-agent-toolkit`.
3. Start Gemini CLI and authenticate: `/mcp auth maton`.

### OpenClaw

Register the Maton MCP server in your `openclaw.json` under `mcp.servers`, then authenticate via OAuth in the browser on first use:

```json
{
  "mcp": {
    "servers": {
      "maton": {
        "url": "https://mcp.maton.ai",
        "transport": "streamable-http",
        "auth": "oauth"
      }
    }
  }
}
```

## Manual installation

If you'd rather not use a plugin, register the Maton MCP server directly in your MCP client config (`.mcp.json` for Claude Code, `mcp.json` for Cursor):

```json
{
  "mcpServers": {
    "maton": {
      "type": "http",
      "url": "https://mcp.maton.ai"
    }
  }
}
```

## License

[MIT](LICENSE)
