// Context are settings that are applied to all requests made by the integration.
export type Context = {
  // Connection is a Maton connection ID. If set, the integration will route
  // requests through this connection (sent as the Maton-Connection header).
  connection?: string;

  // If set to 'modelcontextprotocol', the Maton MCP calls will use a special
  // User-Agent header.
  mode?: 'modelcontextprotocol' | 'toolkit';
};

// Configuration provides various settings and options for the integration
// to tune and manage how it behaves.
export type Configuration = {
  context?: Context;
};
