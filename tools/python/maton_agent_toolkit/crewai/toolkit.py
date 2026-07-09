"""Maton Agent Toolkit for CrewAI."""

import asyncio
from typing import List, Any, Type, Callable, Awaitable

from pydantic import BaseModel
from crewai.tools import BaseTool

from ..shared.toolkit_core import ToolkitCore
from ..shared.mcp_client import McpTool
from ..shared.schema_utils import json_schema_to_pydantic_model
from ..configuration import Configuration


class MatonTool(BaseTool):
    """Tool for interacting with Maton via MCP."""

    run_tool: Callable[..., Awaitable[str]]
    method: str
    name: str = ""
    description: str = ""
    args_schema: Type[BaseModel] | None = None

    def _run(self, **kwargs: Any) -> str:
        """Synchronous execution - wraps async call."""
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're already in an async context, create a new loop
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                future = pool.submit(
                    asyncio.run,
                    self.run_tool(self.method, kwargs)
                )
                return future.result()
        else:
            return loop.run_until_complete(
                self.run_tool(self.method, kwargs)
            )

    async def _arun(self, **kwargs: Any) -> str:
        """Async execution via MCP."""
        return await self.run_tool(self.method, kwargs)


class MatonAgentToolkit(ToolkitCore[List[MatonTool]]):
    """
    Maton Agent Toolkit for CrewAI.

    Example:
        toolkit = await create_maton_agent_toolkit(
            api_key='YOUR_MATON_API_KEY',
        )
        tools = toolkit.get_tools()
        agent = Agent(role="...", tools=tools)
        await toolkit.close()
    """

    def __init__(
        self,
        api_key: str | None = None,
        configuration: Configuration | None = None
    ):
        super().__init__(api_key, configuration)

    def _empty_tools(self) -> List[MatonTool]:
        """Return empty list of tools."""
        return []

    def _convert_tools(
        self,
        mcp_tools: List[McpTool]
    ) -> List[MatonTool]:
        """Convert MCP tools to CrewAI MatonTool instances."""
        tools = []
        for mcp_tool in mcp_tools:
            # Convert JSON Schema to Pydantic model
            args_schema = json_schema_to_pydantic_model(
                mcp_tool.get("inputSchema"),
                model_name=f"{mcp_tool['name']}_args"
            )

            tools.append(MatonTool(
                run_tool=self.run_tool,
                method=mcp_tool["name"],
                name=mcp_tool["name"],
                description=mcp_tool.get("description", mcp_tool["name"]),
                args_schema=args_schema,
            ))
        return tools

    @property
    def tools(self) -> List[MatonTool]:
        """
        The tools available in the toolkit.

        .. deprecated::
            Access tools via get_tools() after calling initialize().
        """
        return self._get_tools_with_warning()


async def create_maton_agent_toolkit(
    api_key: str | None = None,
    configuration: Configuration | None = None
) -> MatonAgentToolkit:
    """
    Factory function to create and initialize a MatonAgentToolkit.

    This is the recommended way to create a toolkit as it handles
    async initialization automatically.

    Example:
        toolkit = await create_maton_agent_toolkit(
            api_key='YOUR_MATON_API_KEY',
        )
        tools = toolkit.get_tools()

        # Use with CrewAI agent
        agent = Agent(role="Maton Agent", tools=tools)

        # Clean up when done
        await toolkit.close()

    Args:
        api_key: Maton API key. Create one at https://maton.ai
        configuration: Optional configuration for context

    Returns:
        Initialized MatonAgentToolkit ready to use
    """
    toolkit = MatonAgentToolkit(api_key, configuration)
    await toolkit.initialize()
    return toolkit
