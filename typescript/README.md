# Maton Agent Toolkit - TypeScript

The Maton Agent Toolkit enables popular agent frameworks including LangChain and Vercel's AI SDK to integrate with Maton APIs through function calling. It also provides tooling to quickly integrate metered billing for prompt and completion token usage.

To get started, get your API key in your [Maton Dashboard][api-keys] and check out [documentation][docs].

## Installation

You don't need this source code unless you want to modify the package. If you just
want to use the package run:

```
npm install @maton/agent-toolkit
```

### Requirements

- Node 18+

### Usage

## Model Context Protocol

The Maton Agent Toolkit also supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.com/).

To run the Maton MCP server using npx, use the following command:

### API Agent (Beta)

```bash
# To use API agent
npx -y @maton/mcp hubspot --agent --api-key=YOUR_MATON_API_KEY
```

### API Action

```bash
# To set up all available API actions
npx -y @maton/mcp hubspot --actions=all --api-key=YOUR_MATON_API_KEY

# To set up all available API actions
npx -y @maton/mcp hubspot --actions=create-contact,list-contacts --api-key=YOUR_MATON_API_KEY
```

Replace `YOUR_MATON_API_KEY` with your actual Maton API key. Or, you could set the MATON_API_KEY in your environment variables. You can get your API key in your [Maton Dashboard][api-keys].

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

```
{
  "mcpServers": {
    "maton": {
      "command": "npx",
      "args": [
          "-y",
          "@maton/mcp",
          "hubspot",
          "--actions=all",
          "--api-key=YOUR_MATON_API_KEY"
      ]
    }
  }
}
```

Make sure to replace `YOUR_MATON_API_KEY` with your actual Maton API key. Alternatively, you could set the MATON_API_KEY in `env` variables. You can get your API key in your [Maton Dashboard][api-keys].

## Available API actions

| App          | Action                                |
| ------------ | ------------------------------------- |
| `hubspot`    | `create-contact`                      |
| `hubspot`    | `get-contact`                         |
| `hubspot`    | `list-contacts`                       |
| `hubspot`    | `search-contacts`                     |
| `hubspot`    | `merge-contacts`                      |
| `hubspot`    | `update-contact`                      |
| `hubspot`    | `delete-contact`                      |
| `hubspot`    | `create-deal`                         |
| `hubspot`    | `get-deal`                            |
| `hubspot`    | `list-deals`                          |
| `hubspot`    | `search-deals`                        |
| `hubspot`    | `merge-deals`                         |
| `hubspot`    | `update-deal`                         |
| `hubspot`    | `delete-deal`                         |
| `klaviyo`    | `add-profiles-to-list`                |
| `klaviyo`    | `assign-template-to-campaign-message` |
| `klaviyo`    | `create-campaign`                     |
| `klaviyo`    | `create-list`                         |
| `klaviyo`    | `create-profile`                      |
| `klaviyo`    | `create-template`                     |
| `klaviyo`    | `get-campaign-messages`               |
| `klaviyo`    | `get-campaign-send-job`               |
| `klaviyo`    | `get-campaigns`                       |
| `klaviyo`    | `get-lists`                           |
| `klaviyo`    | `get-profiles-for-list`               |
| `klaviyo`    | `get-profiles`                        |
| `klaviyo`    | `get-templates`                       |
| `klaviyo`    | `send-campaign`                       |
| `salesforce` | `create-contact`                      |
| `salesforce` | `get-contact`                         |
| `salesforce` | `list-contacts`                       |

[api-keys]: https://maton.ai/api-keys
[docs]: https://maton.ai/docs/api-reference
