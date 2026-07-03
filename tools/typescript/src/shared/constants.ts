/**
 * Shared constants for the Maton Agent Toolkit.
 * VERSION is injected at build time from package.json via tsup.config.ts
 */

declare const process: {
  env: {PACKAGE_VERSION?: string; MATON_MCP_SERVER_URL?: string};
};

export const VERSION = process.env.PACKAGE_VERSION || '0.0.0-development';
export const MCP_SERVER_URL =
  process.env.MATON_MCP_SERVER_URL || 'https://mcp.maton.ai';
export const TOOLKIT_HEADER = 'maton-agent-toolkit-typescript';
export const MCP_HEADER = 'maton-mcp-typescript';
