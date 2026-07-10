"""Ensure the package version is single-sourced from constants.py.

VERSION in constants.py is the sole source of truth for the package version.
pyproject.toml declares the version as dynamic and resolves it from that
attribute via setuptools (``[tool.setuptools.dynamic]``), so there is no second
copy to keep in sync. This test guards that wiring: if the dynamic config is
removed or a static ``version`` is reintroduced, it fails loudly.
"""

import tomllib
import unittest
from pathlib import Path

from maton_agent_toolkit import __version__
from maton_agent_toolkit.shared.constants import VERSION


class TestVersion(unittest.TestCase):
    def test_pyproject_single_sources_version_from_constants(self):
        pyproject = Path(__file__).resolve().parents[1] / "pyproject.toml"
        with pyproject.open("rb") as f:
            data = tomllib.load(f)

        project = data["project"]
        self.assertNotIn(
            "version",
            project,
            "pyproject.toml must not hardcode a static version; it should be "
            "declared dynamic and resolved from constants.VERSION.",
        )
        self.assertIn(
            "version",
            project.get("dynamic", []),
            "pyproject.toml must declare version in [project].dynamic.",
        )

        dynamic = data["tool"]["setuptools"]["dynamic"]
        self.assertEqual(
            dynamic["version"]["attr"],
            "maton_agent_toolkit.shared.constants.VERSION",
            "setuptools dynamic version must resolve from constants.VERSION.",
        )

    def test_dunder_version_matches_constant(self):
        self.assertEqual(__version__, VERSION)


if __name__ == "__main__":
    unittest.main()
