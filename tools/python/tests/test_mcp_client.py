"""Tests for MatonMcpClient."""

import pytest

from maton_agent_toolkit.shared.mcp_client import MatonMcpClient


@pytest.fixture(autouse=True)
def _clear_maton_env(monkeypatch):
    """Ensure MATON_API_KEY doesn't leak in from the real environment."""
    monkeypatch.delenv("MATON_API_KEY", raising=False)


class TestMatonMcpClient:
    """Tests for MatonMcpClient class."""

    def test_init_with_api_key(self):
        """Should accept a non-empty API key."""
        client = MatonMcpClient({"api_key": "maton_test_123"})
        assert client is not None

    def test_init_empty_key_raises(self):
        """Should raise error for an empty API key."""
        with pytest.raises(ValueError, match="Maton API key is required"):
            MatonMcpClient({"api_key": ""})

    def test_init_whitespace_key_raises(self):
        """Should raise error for a whitespace-only API key."""
        with pytest.raises(ValueError, match="Maton API key is required"):
            MatonMcpClient({"api_key": "   "})

    def test_init_missing_key_raises(self):
        """Should raise error when neither arg nor env var is set."""
        with pytest.raises(ValueError, match="Maton API key is required"):
            MatonMcpClient({})

    def test_init_falls_back_to_env_var(self, monkeypatch):
        """Should fall back to the MATON_API_KEY environment variable."""
        monkeypatch.setenv("MATON_API_KEY", "maton_env_123")
        client = MatonMcpClient({})
        assert client._get_headers()["Authorization"] == "Bearer maton_env_123"

    def test_explicit_key_overrides_env_var(self, monkeypatch):
        """An explicit api_key should take precedence over the env var."""
        monkeypatch.setenv("MATON_API_KEY", "maton_env_123")
        client = MatonMcpClient({"api_key": "maton_explicit_456"})
        assert (
            client._get_headers()["Authorization"] == "Bearer maton_explicit_456"
        )

    def test_get_tools_before_connect_raises(self):
        """Should raise if get_tools called before connect."""
        client = MatonMcpClient({"api_key": "maton_test_123"})

        with pytest.raises(RuntimeError, match="not connected"):
            client.get_tools()

    async def test_call_tool_before_connect_raises(self):
        """Should raise if call_tool called before connect."""
        client = MatonMcpClient({"api_key": "maton_test_123"})

        with pytest.raises(RuntimeError, match="not connected"):
            await client.call_tool("run_action", {})

    def test_headers_include_bearer_auth(self):
        """Headers should carry the API key as a bearer token."""
        client = MatonMcpClient({"api_key": "maton_test_123"})
        headers = client._get_headers()
        assert headers["Authorization"] == "Bearer maton_test_123"

    def test_headers_include_connection(self):
        """Headers should include Maton-Connection when configured."""
        client = MatonMcpClient({
            "api_key": "maton_test_123",
            "connection": "conn_123",
        })
        headers = client._get_headers()
        assert headers["Maton-Connection"] == "conn_123"

    @pytest.mark.skip(reason="Requires mocking MCP SDK internals")
    async def test_connect_success(self):
        """Should connect to MCP server successfully."""
        # This test would require extensive mocking of the MCP SDK
        pass


class TestMcpClientConfig:
    """Tests for config storage."""

    def test_config_stores_connection(self):
        """Config should store connection."""
        client = MatonMcpClient({
            "api_key": "maton_test_123",
            "connection": "conn_test_123"
        })

        # The config is stored internally for use during connect
        assert client._config.get("connection") == "conn_test_123"

    def test_config_stores_mode(self):
        """Config should store mode."""
        client = MatonMcpClient({
            "api_key": "maton_test_123",
            "mode": "modelcontextprotocol"
        })

        assert client._config.get("mode") == "modelcontextprotocol"
