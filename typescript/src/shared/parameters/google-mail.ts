import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const addLabelToEmailParameters = z.object({
  message_id: z.string().describe('The ID of the message'),
  label_ids: z
    .array(z.string())
    .describe('List of label IDs to add to the message'),
});

export const createDraftParameters = z.object({
  to: z.array(z.string()).describe('List of recipient emails'),
  subject: z.string().describe('The subject of the email'),
  body: z.string().describe('The body of the email'),
  cc: z.array(z.string()).describe('List of emails to CC').optional(),
  bcc: z.array(z.string()).describe('List of emails to BCC').optional(),
  body_type: z
    .enum(['plaintext', 'html'])
    .describe(
      'The type of the email body. Default: plaintext. Possible values are: plaintext, html'
    )
    .optional(),
});

export const findEmailParameters = z.object({
  q: z.string().describe('The search query'),
  label_ids: z
    .array(z.string())
    .describe(
      'List of label IDs. Only messages that match all of the specified labels are returned.'
    )
    .optional(),
  include_spam_trash: z
    .boolean()
    .describe(
      'Whether to include messages from `SPAM` and `TRASH` in the results. Default: False.'
    )
    .optional(),
  max_results: z
    .number()
    .describe('The maximum number of results to return. Default: 10. Max: 500.')
    .optional(),
});

export const listLabelsParameters = z.object({});

export const sendEmailParameters = z.object({
  to: z.array(z.string()).describe('List of recipient emails'),
  subject: z.string().describe('The subject of the email'),
  body: z.string().describe('The body of the email'),
  cc: z.array(z.string()).describe('List of emails to CC').optional(),
  bcc: z.array(z.string()).describe('List of emails to BCC').optional(),
  body_type: z
    .enum(['plaintext', 'html'])
    .describe(
      'The type of the email body. Default: plaintext. Possible values are: plaintext, html'
    )
    .optional(),
});
