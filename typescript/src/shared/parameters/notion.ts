import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createPageParameters = z.object({
  parent_page_id: z
    .string()
    .describe('The identifier for a Notion parent page'),
  title: z.string().describe('The title of the page'),
  content: z.string().describe('Content of the page'),
});

export const findPageParameters = z.object({
  title: z.string().describe('The title of the page to search'),
});

export const getPageParameters = z.object({
  page_id: z.string().describe('The ID of page'),
});
