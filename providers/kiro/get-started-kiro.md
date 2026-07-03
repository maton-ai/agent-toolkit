---
name: "maton"
displayName: "Maton"
description: "Connect and automate 150+ apps (Google Workspace, Microsoft 365, GitHub, Notion, Slack, HubSpot, and more) through a unified API"
keywords:
  [
    "maton",
    "automation",
    "integrations",
    "api-gateway",
    "mcp",
    "connections",
    "workflows",
  ]
author: "Maton"
---

# Maton MCP

Connect and automate 150+ apps with [Maton](https://maton.ai). Maton is an API gateway — a passthrough proxy for calling external APIs through Maton connections, which handle token refresh and credential injection at runtime. Connect an app once, then call it through pre-built actions or the generic `api` passthrough instead of managing OAuth flows and per-vendor API quirks yourself.

- **Endpoint:** `https://mcp.maton.ai`
- **Auth:** OAuth, or a Maton API key sent as `Authorization: Bearer <key>`.

```json
{
  "mcpServers": {
    "maton": {
      "url": "https://mcp.maton.ai"
    }
  }
}
```

## Tools

- `whoami` — show the authenticated Maton user.
- `create_connection`, `delete_connection`, `list_connections`, `get_connection` — manage app connections. `create_connection` returns an authorize URL the user must visit to complete the handshake.
- `search_apps` — discover supported apps (grep-style search).
- `search_actions` — discover pre-built actions (grep-style search).
- `get_action` — retrieve an action's full input/output schema.
- `run_action` — run a pre-built action with the given arguments.
- `api` — call any external API endpoint through the gateway.

## Workflow

1. **Connect** — `create_connection(app=...)`, have the user visit the returned authorize URL, then confirm it's `ACTIVE` with `list_connections` / `get_connection`.
2. **Discover** — `search_apps` to confirm the app slug, then `search_actions(app=...)` to find actions.
3. **Inspect** — `get_action(id=...)` to learn the exact arguments.
4. **Run** — `run_action(id=..., args=...)`, optionally routing through a specific `connection` ID.
5. **Fallback** — if no action fits, use `api(method, path, ...)` where `path` is `/<app>/<native-api-path>` (e.g. `/slack/api/conversations.list`, `/hubspot/crm/v3/objects/contacts`).

**Prefer pre-built actions over `api`** — they eliminate guesswork about endpoints and shapes, return normalized/stable responses, and often resolve a task in one call. Use `api` only when no action covers the task. Never guess action IDs or app slugs; discover them via search first.

### Example

```text
# List unread Gmail
1. search_actions(app="google-mail", pattern="message")
2. get_action(id="google-mail.message.list")
3. run_action(id="google-mail.message.list", args={ "q": "is:unread" })

# Fallback when no action exists
api(method="GET", path="/slack/api/conversations.list", params={ "limit": 100 })
```

Pass a `connection` ID to select which connection to route through; otherwise the newest active connection is used. Most tools accept a `jq` argument to trim large responses.

## Resources

- [Maton](https://maton.ai)
- [Maton MCP server](https://mcp.maton.ai)

**License:** MIT
