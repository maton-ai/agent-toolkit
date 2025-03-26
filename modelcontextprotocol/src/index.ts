#!/usr/bin/env node

import {MatonAgentToolkit} from '@maton/agent-toolkit/modelcontextprotocol';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {green, red, yellow} from 'colors';

type ToolkitConfig = {
  actions: {[key: string]: boolean};
  context?: {
    account: string;
  };
};

type Options = {
  app?: string;
  agent?: boolean;
  actions?: string[];
  apiKey?: string;
};

const ACCEPTED_ARGS: string[] = ['agent', 'actions', 'api-key'];
const ACCEPTED_APPS: string[] = ['hubspot', 'klaviyo', 'salesforce'];
const ACCEPTED_ACTIONS: {[key: string]: string[]} = {
  hubspot: [
    'create-contact',
    'get-contact',
    'list-contacts',
    'search-contacts',
    'merge-contacts',
    'update-contact',
    'delete-contact',
    'create-deal',
    'get-deal',
    'list-deals',
    'search-deals',
    'merge-deals',
    'update-deal',
    'delete-deal',
  ],
  klaviyo: [
    'add-profiles-to-list',
    'assign-template-to-campaign-message',
    'create-campaign',
    'create-list',
    'create-profile',
    'create-template',
    'get-campaign-messages',
    'get-campaign-send-job',
    'get-campaigns',
    'get-lists',
    'get-profiles-for-list',
    'get-profiles',
    'get-templates',
    'send-campaign',
  ],
  salesforce: ['create-contact', 'get-contact', 'list-contacts'],
};
const BUILTIN_ACTIONS: string[] = ['check-connection', 'start-connection'];

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

  // Check if required arguments are present
  if (!options.app) {
    throw new Error('The app argument must be provided.');
  }
  if (options.agent && options.actions) {
    throw new Error('Both --agent and --actions arguments cannot be provided.');
  } else if (!options.agent && !options.actions) {
    throw new Error('Either --agent or --actions arguments must be provided.');
  }

  if (!ACCEPTED_APPS.includes(options.app)) {
    throw new Error(
      `Invalid app: ${options.app}. Accepted apps are: ${ACCEPTED_APPS.join(
        ', '
      )}`
    );
  }

  if (options.actions) {
    options.actions.forEach((action: string) => {
      if (action == 'all') {
        return;
      }
      if (!ACCEPTED_ACTIONS[options.app!].includes(action.trim())) {
        throw new Error(
          `Invalid action: ${action}. Accepted actions are: ${ACCEPTED_ACTIONS[
            options.app!
          ].join(', ')}`
        );
      }
    });
  }

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

function getMethod(app: string, action: string) {
  return `${app!}_${action.replaceAll('-', '_')}`;
}

function handleError(error: any) {
  console.error(red('\n🚨  Error initializing Maton MCP server:\n'));
  console.error(yellow(`   ${error.message}\n`));
}

export async function main() {
  const options = parseArgs(process.argv.slice(2));

  const selectedActions = options.actions!;
  const configuration: ToolkitConfig = {actions: {}};

  if (options.agent) {
    const method = getMethod(options.app!, 'transfer-agent');
    configuration.actions[method] = true;
  } else if (selectedActions.includes('all')) {
    ACCEPTED_ACTIONS[options.app!].forEach((action) => {
      const method = getMethod(options.app!, action);
      configuration.actions[method] = true;
    });
  } else {
    selectedActions.forEach((action) => {
      const method = getMethod(options.app!, action);
      configuration.actions[method] = true;
    });
  }

  BUILTIN_ACTIONS.forEach((action) => {
    const method = getMethod(options.app!, action);
    configuration.actions[method] = true;
  });

  const server = new MatonAgentToolkit({
    secretKey: options.apiKey!,
    configuration: configuration,
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
