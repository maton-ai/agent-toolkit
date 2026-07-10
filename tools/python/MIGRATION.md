# Migration Guide: API to MCP Architecture

This guide covers migrating from the direct API-based toolkit to the MCP-based architecture (v0.1.0+).

Instead of bundling a fixed set of per-app actions, the toolkit now connects to the remote [Maton MCP server](https://mcp.maton.ai), discovers the available tools at runtime, and exposes them in each framework's native tool format (OpenAI Agents SDK, LangChain, CrewAI, and Strands).

## Breaking Changes

### 1. Async Initialization Required

Toolkit initialization now connects to `mcp.maton.ai` and must be awaited.

```python
# Before (direct API)
from maton_agent_toolkit.openai.toolkit import MatonAgentToolkit

toolkit = MatonAgentToolkit(api_key="YOUR_MATON_API_KEY", configuration={"app": "hubspot", "actions": ["create-contact"]})
tools = toolkit.tools

# After (v0.1.0+)
from maton_agent_toolkit.openai.toolkit import create_maton_agent_toolkit

toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
tools = toolkit.get_tools()
await toolkit.close()  # Clean up when done
```

**Impact:** Synchronous usage will throw: `"MatonAgentToolkit not initialized. Use \`await create_maton_agent_toolkit()\` factory (recommended) or call \`await toolkit.initialize()\` first."`

### 2. MCP Connection Required

Tools are fetched from `mcp.maton.ai`. The toolkit connects with your key in the `Authorization: Bearer` header. If the server is unreachable, initialization fails with no fallback.

**Impact:** Ensure network access to `mcp.maton.ai` (HTTPS port 443) in all environments.

### 3. `app` / `agent` / `actions` Configuration Removed

The old configuration options — `app`, `agent`, and `actions` — have been removed. You no longer pre-select a single app or a static list of actions at construction time. The toolkit exposes whatever tools the Maton MCP server provides, and the agent discovers and connects apps dynamically at runtime.

```python
# Before (direct API)
toolkit = MatonAgentToolkit(
    api_key="YOUR_MATON_API_KEY",
    configuration={
        "app": "hubspot",
        "actions": ["create-contact", "list-contacts"],
        # or: "agent": True
    },
)

# After (v0.1.0+)
toolkit = await create_maton_agent_toolkit(
    api_key="YOUR_MATON_API_KEY",
    configuration={
        "context": {"connection": "conn_123"},  # Only context options remain
    },
)
```

**Impact:** Remove `app`, `agent`, and `actions` from your configuration. There is no longer an app allowlist or action allowlist. The agent chooses apps and actions at runtime through the discovery and `run_action` tools.

### 4. Tool Names Changed to Generic MCP Tools

Tools are no longer generated per app/action as `<app>_<action>` methods. The toolkit now exposes the Maton MCP server's generic tool set, and the target app is selected at call time.

| Old (per-app methods)    | New (generic MCP tools)                        |
| ------------------------ | ---------------------------------------------- |
| `hubspot_create_contact` | `run_action`                                   |
| `hubspot_list_contacts`  | `run_action`                                   |
| `<app>_check_connection` | `list_connections` / `create_connection`       |
| `<app>_start_connection` | `create_connection`                            |
| (per-app discovery)      | `search_apps`, `search_actions`, `get_action`  |
| (n/a)                    | `whoami`, `api` (generic gateway passthrough)  |

**Impact:** Update any custom tool-filtering or tool-name matching logic. Instead of matching `hubspot_create_contact`, the agent calls `search_actions` / `get_action` to discover an action and `run_action` to execute it.

### 5. `mcp` Package Now Required

The `mcp` package is now a required dependency used to connect to `mcp.maton.ai`:

```bash
uv pip install maton-agent-toolkit
```

### 6. `.tools` Property Deprecated

Accessing tools via the `.tools` property is deprecated. Use `get_tools()` after initialization instead. Accessing `.tools` before initialization emits a warning and returns an empty list.

---

## New API

There are two ways to initialize the toolkit. Both are valid—choose whichever fits your code structure better.

### Option 1: Factory Function (Recommended)

The simplest approach. Creates and initializes the toolkit in one step:

```python
from maton_agent_toolkit.openai.toolkit import create_maton_agent_toolkit
# Also available: .langchain.toolkit, .crewai.toolkit, .strands.toolkit

async def main():
    toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
    try:
        tools = toolkit.get_tools()
        # ... use tools ...
    finally:
        await toolkit.close()
```

### Option 2: Constructor + initialize()

If you need to create the toolkit instance separately from initialization (e.g., for dependency injection or delayed initialization):

```python
from maton_agent_toolkit.openai.toolkit import MatonAgentToolkit

toolkit = MatonAgentToolkit(api_key="YOUR_MATON_API_KEY")

# Later, when ready to use:
async def main():
    await toolkit.initialize()
    try:
        tools = toolkit.get_tools()
        # ... use tools ...
    finally:
        await toolkit.close()
```

### Cleanup

Always close the MCP connection when done:

```python
await toolkit.close()
```

---

## Configuration

The `api_key` defaults to the `MATON_API_KEY` environment variable if not provided. Create a key at [maton.ai](https://maton.ai).

### Context

You can provide a default `connection` that all requests route through (sent as the `Maton-Connection` header). If omitted, Maton uses the newest active connection for the target app.

```python
toolkit = await create_maton_agent_toolkit(
    api_key="YOUR_MATON_API_KEY",
    configuration={
        "context": {
            "connection": "conn_123",
        },
    },
)
```

---

## Framework-Specific Examples

### OpenAI Agents SDK

```python
import asyncio
from agents import Agent, Runner
from maton_agent_toolkit.openai.toolkit import create_maton_agent_toolkit

async def main():
    toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
    try:
        agent = Agent(
            name="Maton Agent",
            instructions="You are an expert at automating apps with Maton",
            tools=toolkit.get_tools(),
        )
        result = await Runner.run(agent, "Create a HubSpot contact for a@b.co")
        print(result.final_output)
    finally:
        await toolkit.close()

asyncio.run(main())
```

### LangChain

```python
import asyncio
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from maton_agent_toolkit.langchain.toolkit import create_maton_agent_toolkit

async def main():
    toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
    try:
        llm = ChatOpenAI(model="gpt-4o")
        agent = create_react_agent(llm, toolkit.get_tools())
        result = agent.invoke({"messages": "List my HubSpot contacts"})
        print(result["messages"][-1].content)
    finally:
        await toolkit.close()

asyncio.run(main())
```

### CrewAI

```python
import asyncio
from crewai import Agent, Task, Crew
from maton_agent_toolkit.crewai.toolkit import create_maton_agent_toolkit

async def main():
    toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
    try:
        agent = Agent(
            role="Maton Agent",
            goal="Automate apps with Maton",
            tools=toolkit.get_tools(),
        )
        task = Task(description="Create a HubSpot contact", agent=agent)
        crew = Crew(agents=[agent], tasks=[task])
        crew.kickoff()
    finally:
        await toolkit.close()

asyncio.run(main())
```

### Strands

```python
import asyncio
from strands import Agent
from maton_agent_toolkit.strands.toolkit import create_maton_agent_toolkit

async def main():
    toolkit = await create_maton_agent_toolkit(api_key="YOUR_MATON_API_KEY")
    try:
        agent = Agent(tools=toolkit.get_tools())
        response = agent("List my HubSpot contacts")
        print(response)
    finally:
        await toolkit.close()

asyncio.run(main())
```

---

## Migration Checklist

- [ ] Use `create_maton_agent_toolkit()` factory function with `await`
- [ ] Remove `app`, `agent`, and `actions` from your configuration
- [ ] Switch from the `.tools` property to `get_tools()`
- [ ] Update tool-name matching from `<app>_<action>` methods to the generic MCP tools (`run_action`, `search_actions`, `get_action`, …)
- [ ] Add error handling for MCP connection failures
- [ ] Ensure `mcp.maton.ai` is accessible in all environments
- [ ] Add `await toolkit.close()` for cleanup (use try/finally)

## Troubleshooting

### Connection Errors

If the toolkit fails to connect to the Maton MCP server:

1. Check network connectivity to `mcp.maton.ai`
2. Verify your `MATON_API_KEY` is valid
3. Ensure your firewall allows HTTPS (port 443) outbound

### "Not initialized" Errors

If you see `MatonAgentToolkit not initialized`:

- Make sure you're using `await create_maton_agent_toolkit()`
- Or call `await toolkit.initialize()` after constructing the toolkit

## Getting Help

- GitHub Issues: https://github.com/maton-ai/agent-toolkit/issues
- Maton Dashboard: https://maton.ai
