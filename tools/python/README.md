# Maton Agent Toolkit - Python

The Maton Agent Toolkit connects popular agent frameworks — OpenAI's Agents SDK, LangChain, CrewAI, and Strands — to the [Maton MCP server](https://mcp.maton.ai) through function calling. Instead of bundling a fixed set of actions, the toolkit connects to the remote Maton MCP server, discovers the available tools, and exposes them in each framework's native tool format. This lets your agent connect and automate 150+ apps (Google Workspace, Microsoft 365, GitHub, Notion, Slack, HubSpot, and more).

## Installation

You don't need this source code unless you want to modify the package. If you just want to use the package, just run:

```sh
uv pip install maton-agent-toolkit
```

### Requirements

-   Python 3.11+

## Usage

The library needs to be configured with your Maton API key. You can create one at [maton.ai](https://maton.ai), or set the `MATON_API_KEY` environment variable. The toolkit connects to `https://mcp.maton.ai` with your key in the `Authorization: Bearer` header.

```python
from maton_agent_toolkit.openai.toolkit import create_maton_agent_toolkit

async def main():
    toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
    tools = toolkit.get_tools()
    # ... use tools ...
    await toolkit.close()  # Clean up when done
```

The toolkit works with OpenAI's Agents SDK, LangChain, CrewAI, and Strands and can be passed as a list of tools. For example:

```python
from agents import Agent

async def main():
    toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")

    maton_agent = Agent(
        name="Maton Agent",
        instructions="You are an expert at automating apps with Maton",
        tools=toolkit.get_tools()
    )
    # ... use agent ...
    await toolkit.close()
```

Import from the framework-specific module you need:

- `maton_agent_toolkit.openai.toolkit`
- `maton_agent_toolkit.langchain.toolkit`
- `maton_agent_toolkit.crewai.toolkit`
- `maton_agent_toolkit.strands.toolkit`

### Context

You can provide a default `connection` that all requests route through (sent as the `Maton-Connection` header). If omitted, Maton uses the newest active connection for the target app.

```python
toolkit = await create_maton_agent_toolkit(
    api_key="YOUR_MATON_API_KEY",
    configuration={
        "context": {
            "connection": "conn_123"
        }
    }
)
```

## Development

```
uv venv --python 3.11
source .venv/bin/activate
uv pip install -r requirements.txt
```
