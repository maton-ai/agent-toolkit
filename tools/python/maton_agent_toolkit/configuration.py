"""Configuration types for Maton Agent Toolkit."""

from typing import Optional
from typing_extensions import TypedDict


class Context(TypedDict, total=False):
    """Context for MCP connection."""
    connection: Optional[str]
    mode: Optional[str]


class Configuration(TypedDict, total=False):
    """Configuration for Maton Agent Toolkit."""
    context: Optional[Context]
