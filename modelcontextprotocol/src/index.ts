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
const ACCEPTED_APPS: string[] = [
  'airtable',
  'asana',
  'aws',
  'calendly',
  'clickup',
  'google-calendar',
  'google-docs',
  'google-drive',
  'google-mail',
  'google-sheet',
  'hubspot',
  'jira',
  'jotform',
  'klaviyo',
  'mailchimp',
  'notion',
  'outlook',
  'pipedrive',
  'salesforce',
  'shopify',
  'slack',
  'stripe',
  'typeform',
  'youtube',
];
const ACCEPTED_ACTIONS: {[key: string]: string[]} = {
  airtable: ['list-bases', 'list-records', 'list-tables'],
  asana: [
    'create-task',
    'get-task',
    'list-projects',
    'list-tasks',
    'list-workspaces',
  ],
  aws: ['get-s3-object', 'list-s3-buckets', 'list-s3-objects'],
  calendly: [
    'get-event',
    'list-event-invitees',
    'list-event-types',
    'list-events',
  ],
  clickup: [
    'create-task',
    'delete-task',
    'get-task',
    'list-folders',
    'list-lists',
    'list-spaces',
    'list-tasks',
    'list-workspaces',
  ],
  'google-calendar': [
    'create-event',
    'delete-event',
    'get-calendar',
    'get-event',
    'list-calendars',
    'list-events',
    'update-event',
  ],
  'google-docs': [
    'append-text',
    'create-document',
    'find-document',
    'get-document',
  ],
  'google-drive': [
    'create-file',
    'create-folder',
    'delete-file',
    'find-file',
    'find-folder',
    'get-file',
    'list-files',
  ],
  'google-mail': [
    'add-label-to-email',
    'create-draft',
    'find-email',
    'list-labels',
    'send-email',
  ],
  'google-sheet': [
    'add-column',
    'add-multiple-rows',
    'clear-cell',
    'clear-rows',
    'create-spreadsheet',
    'create-worksheet',
    'delete-rows',
    'delete-worksheet',
    'find-row',
    'get-cell',
    'get-spreadsheet',
    'get-values-in-range',
    'list-worksheets',
    'update-cell',
    'update-multiple-rows',
    'update-row',
  ],
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
  jira: [
    'list-clouds',
    'get-issue',
    'list-issues',
    'add-comment-to-issue',
    'list-comments',
    'update-comment',
    'list-projects',
    'get-user',
    'list-users',
  ],
  jotform: ['list-forms', 'list-submissions'],
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
  mailchimp: ['get-campaign', 'search-campaign'],
  notion: ['create-page', 'find-page', 'get-page'],
  outlook: ['create-draft', 'find-email', 'send-email'],
  pipedrive: ['search-people'],
  salesforce: ['create-contact', 'get-contact', 'list-contacts'],
  shopify: ['create-order', 'get-order', 'list-orders'],
  slack: ['list-channels', 'list-messages', 'list-replies', 'send-message'],
  stripe: [
    'create-customer',
    'create-invoice-item',
    'create-invoice',
    'delete-customer',
    'get-customer',
    'get-invoice',
    'list-customers',
    'list-invoices',
  ],
  typeform: ['get-form', 'list-forms', 'list-responses'],
  youtube: ['list-videos', 'search-videos'],
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
