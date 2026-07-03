"""Shared infrastructure for Maton Agent Toolkit MCP integration."""

from .constants import VERSION, MCP_SERVER_URL, TOOLKIT_HEADER, MCP_HEADER
from .async_initializer import AsyncInitializer
from .mcp_client import MatonMcpClient, McpTool, McpToolInputSchema
from .schema_utils import json_schema_to_pydantic_model, json_schema_to_pydantic_fields
from .toolkit_core import ToolkitCore

__all__ = [
    "VERSION",
    "MCP_SERVER_URL",
    "TOOLKIT_HEADER",
    "MCP_HEADER",
    "AsyncInitializer",
    "MatonMcpClient",
    "McpTool",
    "McpToolInputSchema",
    "json_schema_to_pydantic_model",
    "json_schema_to_pydantic_fields",
    "ToolkitCore",
]
