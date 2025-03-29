import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const listBasesParameters = z.object({});

export const listRecordsParameters = z.object({
  base_id: z.string().describe('The base ID of the Airtable app'),
  table_id: z.string().describe('The ID of the table'),
});

export const listTablesParameters = z.object({
  base_id: z.string().describe('The base ID of the Airtable app'),
});
