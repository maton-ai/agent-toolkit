"""Tests for Configuration types."""

import unittest
from maton_agent_toolkit.configuration import Configuration, Context


class TestConfiguration(unittest.TestCase):
    """Tests for Configuration type."""

    def test_empty_configuration(self):
        """Empty configuration should be valid."""
        config: Configuration = {}
        self.assertEqual(config, {})

    def test_configuration_with_context(self):
        """Configuration with context should be valid."""
        config: Configuration = {
            "context": {
                "connection": "conn_123",
            }
        }
        self.assertEqual(config["context"]["connection"], "conn_123")

    def test_context_with_mode(self):
        """Context with mode should be valid."""
        context: Context = {
            "connection": "conn_123",
            "mode": "modelcontextprotocol",
        }
        self.assertEqual(context["mode"], "modelcontextprotocol")


if __name__ == "__main__":
    unittest.main()
