"""Client for connecting to the Maton MCP server at mcp.maton.ai."""

import json
import os
import warnings
from contextlib import asynccontextmanager
from typing import List, Dict, Any, AsyncGenerator
from typing_extensions import TypedDict

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

from .async_initializer import AsyncInitializer
from .constants import VERSION, MCP_SERVER_URL, TOOLKIT_HEADER, MCP_HEADER


class McpToolInputSchema(TypedDict, total=False):
    """JSON Schema for MCP tool input."""

    type: str
    properties: Dict[str, Any]
    required: List[str]


class McpTool(TypedDict, total=False):
    """MCP tool definition."""

    name: str
    description: str
    inputSchema: McpToolInputSchema


class McpClientConfig(TypedDict, total=False):
    """Configuration for MCP client."""

    api_key: str | None
    connection: str | None
    mode: str | None  # 'modelcontextprotocol' | 'toolkit'


class MatonMcpClient:
    """
    Client for connecting to the Maton MCP server at mcp.maton.ai.
    Fetches tool definitions and executes tool calls via MCP protocol.
    """

    def __init__(self, config: McpClientConfig):
        self._config = config
        self._tools: List[McpTool] = []
        self._initializer = AsyncInitializer()

        self._api_key = self._resolve_key(config.get("api_key"))

    def _resolve_key(self, key: str | None) -> str:
        """Resolve the API key, falling back to the MATON_API_KEY env var."""
        api_key = key or os.environ.get("MATON_API_KEY")
        if not api_key or not api_key.strip():
            raise ValueError(
                "Maton API key is required. Pass it as `api_key` or set the "
                "MATON_API_KEY environment variable. "
                "Create one at https://maton.ai."
            )
        return api_key

    def _get_headers(self) -> Dict[str, str]:
        """Build headers for MCP requests."""
        user_agent = (
            f"{MCP_HEADER}/{VERSION}"
            if self._config.get("mode") == "modelcontextprotocol"
            else f"{TOOLKIT_HEADER}/{VERSION}"
        )

        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "User-Agent": user_agent,
        }

        if self._config.get("connection"):
            headers["Maton-Connection"] = self._config["connection"]

        return headers

    @asynccontextmanager
    async def _create_session(self) -> AsyncGenerator[ClientSession, None]:
        """Create an MCP session within a proper async context.

        This ensures the connection lifecycle is managed correctly by
        using async with blocks, avoiding task group context issues.
        """
        headers = self._get_headers()

        async with streamablehttp_client(
            MCP_SERVER_URL,
            headers=headers,
            terminate_on_close=False
        ) as (read_stream, write_stream, _):
            async with ClientSession(read_stream, write_stream) as session:
                await session.initialize()
                yield session

    async def connect(self) -> None:
        """Connect to MCP server and fetch available tools."""
        await self._initializer.initialize(self._do_connect)

    async def _do_connect(self) -> None:
        """Internal connection logic."""
        try:
            async with self._create_session() as session:
                result = await session.list_tools()
                self._tools = [
                    McpTool(
                        name=t.name,
                        description=t.description or t.name,
                        inputSchema=t.inputSchema,
                    )
                    for t in result.tools
                ]
        except Exception as e:
            raise RuntimeError(
                f"Failed to connect to Maton MCP server at {MCP_SERVER_URL}. "
                f"Error: {str(e)}"
            ) from e

    @property
    def is_connected(self) -> bool:
        """Check if connected to MCP server."""
        return self._initializer.is_initialized

    def get_tools(self) -> List[McpTool]:
        """Get available tools. Must call connect() first."""
        if not self._initializer.is_initialized:
            raise RuntimeError(
                "MCP client not connected. "
                "Call connect() before accessing tools."
            )
        return self._tools

    async def call_tool(
        self,
        name: str,
        args: Dict[str, Any],
        connection: str | None = None
    ) -> str:
        """
        Execute a tool via MCP.

        Args:
            name: Tool method name (e.g., 'run_action')
            args: Tool arguments
            connection: Optional per-call connection override

        Returns:
            JSON string result
        """
        if not self._initializer.is_initialized:
            raise RuntimeError(
                "MCP client not connected. "
                "Call connect() before calling tools."
            )

        # Connection priority: per-call override > connection-time context > none
        final_connection = connection or self._config.get("connection")

        # Warn if args.connection exists and differs from override
        if (
            final_connection
            and args.get("connection")
            and args["connection"] != final_connection
        ):
            warnings.warn(
                f"[Maton Agent Toolkit] Connection context conflict detected:\n"
                f"  - Tool args.connection: {args['connection']}\n"
                f"  - Override connection: {final_connection}\n"
                f"  Using override connection. "
                f"This may indicate a bug in your code."
            )

        # Inject connection into args if present
        final_args = {**args}
        if final_connection:
            final_args["connection"] = final_connection

        try:
            async with self._create_session() as session:
                result = await session.call_tool(name, final_args)

                if result.isError:
                    error_text = next(
                        (
                            getattr(c, "text", None)
                            for c in result.content
                            if hasattr(c, "text")
                        ),
                        "Tool execution failed"
                    )
                    raise RuntimeError(str(error_text))

                # Extract text content
                text_content = next(
                    (
                        getattr(c, "text", None)
                        for c in result.content
                        if hasattr(c, "text")
                    ),
                    None
                )

                if text_content:
                    return text_content

                return json.dumps(result.model_dump())

        except Exception as e:
            raise RuntimeError(
                f"Failed to execute tool '{name}': {str(e)}"
            ) from e

    async def disconnect(self) -> None:
        """Disconnect from MCP server. Safe to call multiple times.

        Note: With this architecture, connections are opened and closed
        per-operation, so this just resets the initialized state.
        """
        if not self._initializer.is_initialized:
            return

        self._tools = []
        self._initializer.reset()
