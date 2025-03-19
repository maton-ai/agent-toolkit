# Maton Agent Toolkit - TypeScript

The Maton Agent Toolkit enables popular agent frameworks including LangChain and Vercel's AI SDK to integrate with Maton APIs through function calling. It also provides tooling to quickly integrate metered billing for prompt and completion token usage.

You can get your API key on the [Maton console][api-keys].

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

```bash
# To use agent
npx -y @maton/mcp hubspot --agent --api-key=YOUR_MATON_API_KEY

# To set up all available actions
npx -y @maton/mcp hubspot --actions=all --api-key=YOUR_MATON_API_KEY

# To set up all available actions
npx -y @maton/mcp hubspot --actions=create-contact,list-contacts --api-key=YOUR_MATON_API_KEY
```

Replace `YOUR_MATON_API_KEY` with your actual Maton API key. Or, you could set the MATON_API_KEY in your environment variables.

## Available actions

| App                   | Action                          |
| --------------------- | ------------------------------- |
| `hubspot`             | `create-contact`                |
| `hubspot`             | `get-contact`                   |
| `hubspot`             | `list-contacts`                 |
| `hubspot`             | `search-contacts`               |
| `hubspot`             | `merge-contacts`                |
| `hubspot`             | `update-contact`                |
| `hubspot`             | `delete-contact`                |
| `hubspot`             | `create-deal`                   |
| `hubspot`             | `get-deal`                      |
| `hubspot`             | `list-deals`                    |
| `hubspot`             | `search-deals`                  |
| `hubspot`             | `merge-deals`                   |
| `hubspot`             | `update-deal`                   |
| `hubspot`             | `delete-deal`                   |
| `salesforce`          | `create-contact`                |
| `salesforce`          | `get-contact`                   |
| `salesforce`          | `list-contacts`                 |

[api-keys]: https://maton.ai/api-keys
