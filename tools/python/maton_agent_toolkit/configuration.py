"""Configuration types for Maton Agent Toolkit."""

from typing_extensions import TypedDict


class Context(TypedDict, total=False):
    """Context for MCP connection."""
    connection: str | None
    mode: str | None


class Configuration(TypedDict, total=False):
    """Configuration for Maton Agent Toolkit."""
    context: Context | None
