# Provider Plugins

This directory contains plugins that wire up the [Maton MCP server](https://mcp.maton.ai) for different AI code editors and harnesses.

- `claude/plugin` — plugin for Claude Code (`.mcp.json` + `.claude-plugin/plugin.json`).
- `cursor/plugin` — plugin for Cursor (`mcp.json` + `.cursor-plugin/plugin.json`).
- `codex/plugin` — plugin for Codex (`.mcp.json` + `.codex-plugin/plugin.json`).
- `kiro` — getting-started power for Kiro.

Each plugin points at the remote Maton MCP server at `https://mcp.maton.ai`, which supports both OAuth and API key authentication.
