# Migration Guide: API to MCP Architecture

This guide covers migrating from the direct API-based toolkit (v0.0.x) to the MCP-based architecture (v0.1.0+).

Instead of bundling a fixed set of per-app actions, the toolkit now connects to the remote [Maton MCP server](https://mcp.maton.ai), discovers the available tools at runtime, and exposes them in each framework's native tool format.

## Breaking Changes

### 1. Async Initialization Required

Toolkit initialization now connects to `mcp.maton.ai` and must be awaited.

```typescript
// Before (v0.0.x)
const toolkit = new MatonAgentToolkit({
  app: 'hubspot',
  actions: ['create-contact', 'list-contacts'],
});
const tools = toolkit.getTools();

// After (v0.1.0+)
const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});
const tools = toolkit.getTools();
await toolkit.close(); // Clean up when done
```

**Impact:** Synchronous usage will throw: `"MatonAgentToolkit not initialized. Use \`await createMatonAgentToolkit()\` factory (recommended) or call \`await toolkit.initialize()\` first."`

### 2. MCP Connection Required

Tools are fetched from `mcp.maton.ai`. The toolkit connects with your key in the `Authorization: Bearer` header. If the server is unreachable, initialization fails with no fallback.

**Impact:** Ensure network access to `mcp.maton.ai` (HTTPS port 443) in all environments.

### 3. `app` / `agent` / `actions` Configuration Removed

The old configuration options — `app`, `agent`, and `actions` — have been removed. You no longer pre-select a single app or a static list of actions at construction time. The toolkit exposes whatever tools the Maton MCP server provides, and the agent discovers and connects apps dynamically at runtime.

```typescript
// Before (v0.0.x)
const toolkit = new MatonAgentToolkit({
  app: 'hubspot',
  actions: ['create-contact', 'list-contacts'],
  // or: agent: true
});

// After (v0.1.0+)
const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {
    context: {connection: 'conn_123'}, // Only context options remain
  },
});
```

**Impact:** Remove `app`, `agent`, and `actions` from your configuration. There is no longer an app allowlist or action allowlist. The agent chooses apps and actions at runtime through the discovery and `run_action` tools.

### 4. `apiKey` Moved Under `configuration` Wrapper

The constructor now takes a `ToolkitConfig` object with `apiKey` and a `configuration` field, rather than a flat configuration object.

```typescript
// Before (v0.0.x) — apiKey was a top-level field (or MATON_API_KEY env var)
const toolkit = new MatonAgentToolkit({
  apiKey: '...',
  app: 'hubspot',
  actions: ['all'],
});

// After (v0.1.0+)
const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!, // optional; defaults to MATON_API_KEY env var
  configuration: {},
});
```

### 5. Tool Names Changed to Generic MCP Tools

Tools are no longer generated per app/action as `<app>_<action>` methods. The toolkit now exposes the Maton MCP server's generic tool set, and the target app is selected at call time.

| Old (per-app methods)    | New (generic MCP tools)                       |
| ------------------------ | --------------------------------------------- |
| `hubspot_create_contact` | `run_action`                                  |
| `hubspot_list_contacts`  | `run_action`                                  |
| `<app>_check_connection` | `list_connections` / `create_connection`      |
| `<app>_start_connection` | `create_connection`                           |
| (per-app discovery)      | `search_apps`, `search_actions`, `get_action` |
| (n/a)                    | `whoami`, `api` (generic gateway passthrough) |

**Impact:** Update any custom tool-filtering or tool-name matching logic. Instead of matching `hubspot_create_contact`, the agent calls `search_actions` / `get_action` to discover an action and `run_action` to execute it.

### 6. `@modelcontextprotocol/sdk` Now a Direct Dependency

The MCP SDK is now a direct dependency used to connect to `mcp.maton.ai`. The toolkit bundles a specific version.

---

## New API

There are two ways to initialize the toolkit. Both are valid—choose whichever fits your code structure better.

### Option 1: Factory Function (Recommended)

The simplest approach. Creates and initializes the toolkit in one step:

```typescript
import {createMatonAgentToolkit} from '@maton/agent-toolkit/openai';
// Also available: /ai-sdk, /langchain, /modelcontextprotocol

const toolkit = await createMatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});

const tools = toolkit.getTools();
// ... use tools ...

await toolkit.close(); // Clean up when done
```

### Option 2: Constructor + initialize()

If you need to create the toolkit instance separately from initialization (e.g., for dependency injection or delayed initialization):

```typescript
import MatonAgentToolkit from '@maton/agent-toolkit/openai';

const toolkit = new MatonAgentToolkit({
  apiKey: process.env.MATON_API_KEY!,
  configuration: {},
});

// Later, when ready to use:
await toolkit.initialize();

const tools = toolkit.getTools();
// ... use tools ...

await toolkit.close(); // Clean up when done
```

### Cleanup

Always close the MCP connection when done:

```typescript
await toolkit.close();
```

---

## Configuration

The `apiKey` is optional and defaults to the `MATON_API_KEY` environment variable. Create a key at [maton.ai](https://maton.ai).

### Context

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

---

## Migration Checklist

- [ ] Use `createMatonAgentToolkit()` factory function with `await`
- [ ] Wrap `apiKey` and `configuration` in the new `ToolkitConfig` object
- [ ] Remove `app`, `agent`, and `actions` from your configuration
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

- Make sure you're using `await createMatonAgentToolkit()`
- Or call `await toolkit.initialize()` after constructing the toolkit

## Getting Help

- GitHub Issues: https://github.com/maton-ai/agent-toolkit/issues
- Maton Dashboard: https://maton.ai
