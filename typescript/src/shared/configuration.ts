import type {Tool} from './tools';

export type Actions = {
  [key: string]: boolean;
};

// Context are settings that are applied to all requests made by the integration.
export type Context = {
  // Account is a Stripe Connected Account ID. If set, the integration will
  // make requests for this Account.
  account?: string;
};

// Configuration provides various settings and options for the integration
// to tune and manage how it behaves.
export type Configuration = {
  actions?: Actions;
  context?: Context;
};

export const isToolAllowed = (
  tool: Tool,
  configuration: Configuration
): boolean => {
  return configuration.actions?.[tool.method] ?? false;
};
