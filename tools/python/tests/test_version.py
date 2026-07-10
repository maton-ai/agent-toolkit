"""Ensure the in-code VERSION stays in sync with pyproject.toml.

pyproject.toml is the source of truth for the package version (the release
workflow validates the git tag against it). VERSION in constants.py is a
hand-maintained mirror used for the User-Agent header and __version__, so a
bump to pyproject.toml must be reflected there too. This test fails loudly if
the two drift apart.
"""

import tomllib
import unittest
from pathlib import Path

from maton_agent_toolkit import __version__
from maton_agent_toolkit.shared.constants import VERSION


class TestVersion(unittest.TestCase):
    def test_version_matches_pyproject(self):
        pyproject = Path(__file__).resolve().parents[1] / "pyproject.toml"
        with pyproject.open("rb") as f:
            data = tomllib.load(f)
        expected = data["project"]["version"]

        self.assertEqual(
            VERSION,
            expected,
            "VERSION in constants.py is out of sync with pyproject.toml; "
            "update maton_agent_toolkit/shared/constants.py.",
        )
        self.assertEqual(__version__, expected)


if __name__ == "__main__":
    unittest.main()
