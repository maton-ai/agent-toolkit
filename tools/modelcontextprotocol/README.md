# Maton Model Context Protocol

The Maton [Model Context Protocol](https://modelcontextprotocol.com/) server lets you connect and automate 150+ apps (Google Workspace, Microsoft 365, GitHub, Notion, Slack, Airtable, HubSpot, and more) through function calling. It exposes a small set of tools for discovering apps and pre-built actions, running them, and calling any external API through Maton's gateway.

## Setup

Maton hosts a remote MCP server at https://mcp.maton.ai. It supports both **OAuth** and **API key** (`Authorization: Bearer` header) authentication.

### Remote (OAuth)

Point any MCP client that supports remote HTTP servers at `https://mcp.maton.ai` and complete the OAuth flow in your browser:

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

## Local

To run the Maton MCP server locally using npx (API key auth), use the following command:

```bash
# Basic usage
npx -y @maton/mcp --api-key=YOUR_MATON_API_KEY

# Route calls through a specific connection
npx -y @maton/mcp --api-key=YOUR_MATON_API_KEY --connection=CONNECTION_ID
```

Make sure to replace `YOUR_MATON_API_KEY` with your actual Maton API key. You can create one at https://maton.ai. Alternatively, you can set the `MATON_API_KEY` environment variable instead of passing `--api-key`.

The local CLI is a thin proxy: it speaks stdio to your MCP client and forwards requests to `https://mcp.maton.ai` with your API key in the `Authorization: Bearer` header.

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

```json
{
  "mcpServers": {
    "maton": {
      "command": "npx",
      "args": ["-y", "@maton/mcp", "--api-key=MATON_API_KEY"]
    }
  }
}
```

or if you're using Docker

```json
{
  "mcpServers": {
    "maton": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp/maton", "--api-key=MATON_API_KEY"]
    }
  }
}
```

### Usage with Gemini CLI

1. Install [Gemini CLI](https://google-gemini.github.io/gemini-cli/#-installation) through your preferred method.
2. Install the Maton MCP extension: `gemini extensions install https://github.com/maton-ai/maton-agent-toolkit`.
3. Start Gemini CLI: `gemini`.
4. Go through the OAuth flow: `/mcp auth maton`.

## Available tools

The Maton MCP server exposes tools to discover and run automations:

- `whoami` — show the authenticated Maton user.
- `create_connection`, `delete_connection`, `list_connections`, `get_connection` — manage app connections.
- `search_apps` — discover the 150+ supported apps.
- `search_actions`, `get_action`, `run_action` — discover and run pre-built actions.
- `api` — call any external API endpoint through the Maton gateway.

## Debugging the Server

To debug your server, you can use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector).

First build the server

```
npm run build
```

Run the following command in your terminal:

```bash
# Start MCP Inspector and server
npx @modelcontextprotocol/inspector node dist/index.js --api-key=YOUR_MATON_API_KEY
```

### Build using Docker

First build the server

```
docker build -t mcp/maton .
```

Run the following command in your terminal:

```bash
docker run -p 3000:3000 -p 5173:5173 -v /var/run/docker.sock:/var/run/docker.sock mcp/inspector docker run --rm -i mcp/maton --api-key=YOUR_MATON_API_KEY
```

### Instructions

1. Replace `YOUR_MATON_API_KEY` with your actual Maton API key.
2. Run the command to start the MCP Inspector.
3. Open the MCP Inspector UI in your browser and click Connect to start the MCP server.
4. You can see the list of tools and test each tool individually.
