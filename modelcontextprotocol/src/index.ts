#!/usr/bin/env node

import {MatonAgentToolkit} from '@maton/agent-toolkit/modelcontextprotocol';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {green, red, yellow} from 'colors';

type Options = {
  app?: string;
  agent?: boolean;
  actions?: string[];
  apiKey?: string;
};

const ACCEPTED_ARGS: string[] = ['agent', 'actions', 'api-key'];

export function parseArgs(args: string[]): Options {
  const options: Options = {app: args[0]};

  args.slice(1).forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');

      if (key == 'agent') {
        options.agent = true;
      } else if (key == 'actions') {
        options.actions = value.split(',');
      } else if (key == 'api-key') {
        options.apiKey = value;
      } else {
        throw new Error(
          `Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(
            ', '
          )}`
        );
      }
    }
  });

  // Check if API key is either provided in args or set in environment variables
  const apiKey = options.apiKey || process.env.MATON_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Maton API key not provided. Please either pass it as an argument --api-key=$KEY or set the MATON_API_KEY environment variable.'
    );
  }
  options.apiKey = apiKey;

  return options;
}

function handleError(error: any) {
  console.error(red('\n🚨  Error initializing Maton MCP server:\n'));
  console.error(yellow(`   ${error.message}\n`));
}

export async function main() {
  const options = parseArgs(process.argv.slice(2));

  const server = new MatonAgentToolkit({
    apiKey: options.apiKey,
    app: options.app,
    agent: options.agent,
    actions: options.actions,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // We use console.error instead of console.log since console.log will output to stdio, which will confuse the MCP server
  console.error(green('✅ Maton MCP Server running on stdio'));
}

if (require.main === module) {
  main().catch((error) => {
    handleError(error);
  });
}
