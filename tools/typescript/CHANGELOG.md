# Changelog

All notable changes to `@maton/agent-toolkit` are documented here. This project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-07-10

### Fixed

- Resolved Dependabot alerts by upgrading vulnerable dependencies.
- Added a Jest setup file that polyfills `globalThis.crypto` with `webcrypto`
  so the test suite runs on Node versions without a global WebCrypto.
- Corrected repository references from `maton-ai/maton-agent-toolkit` to
  `maton-ai/agent-toolkit`.

## [0.1.0]

- Initial release.
