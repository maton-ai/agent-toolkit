import type {Tool} from './tools';

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
const AGENT_ACTIONS = ['transfer-agent'];
const BUILTIN_ACTIONS = ['check-connection', 'start-connection'];

export type Actions = {
  [key: string]: boolean;
};

export type Configuration = {
  apiKey?: string;
  app?: string;
  agent?: boolean;
  actions?: string[];
};

function getMethod(app: string, action: string) {
  return `${app}_${action.replaceAll('-', '_')}`;
}

export const checkConfiguration = (configuration: Configuration) => {
  if (!configuration.app) {
    throw new Error('The app argument must be provided.');
  }
  if (configuration.agent && configuration.actions) {
    throw new Error('Both --agent and --actions arguments cannot be provided.');
  } else if (!configuration.agent && !configuration.actions) {
    throw new Error('Either --agent or --actions arguments must be provided.');
  }

  if (!ACCEPTED_APPS.includes(configuration.app)) {
    throw new Error(
      `Invalid app: ${configuration.app}. Accepted apps are: ${ACCEPTED_APPS.join(
        ', '
      )}`
    );
  }

  if (configuration.actions) {
    configuration.actions.forEach((action: string) => {
      if (action == 'all') {
        return;
      }
      if (!ACCEPTED_ACTIONS[configuration.app!].includes(action.trim())) {
        throw new Error(
          `Invalid action: ${action}. Accepted actions are: ${ACCEPTED_ACTIONS[
            configuration.app!
          ].join(', ')}`
        );
      }
    });
  }
};

export const isToolAllowed = (
  tool: Tool,
  configuration: Configuration
): boolean => {
  if (!configuration.app || !tool.method.startsWith(configuration.app)) {
    return false;
  }
  if (
    BUILTIN_ACTIONS.map((action) =>
      getMethod(configuration.app!, action)
    ).includes(tool.method)
  ) {
    return true;
  }
  if (configuration.agent) {
    return AGENT_ACTIONS.map((action) =>
      getMethod(configuration.app!, action)
    ).includes(tool.method);
  } else if (configuration.actions) {
    if (configuration.actions.includes('all')) {
      return !AGENT_ACTIONS.map((action) =>
        getMethod(configuration.app!, action)
      ).includes(tool.method);
    }
    return configuration.actions
      .map((action) => getMethod(configuration.app!, action))
      .includes(tool.method);
  } else {
    return false;
  }
};
