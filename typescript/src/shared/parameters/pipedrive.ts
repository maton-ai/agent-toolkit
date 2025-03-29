import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const searchPeopleParameters = z.object({
  q: z.string().describe('The search query'),
  max_results: z
    .number()
    .describe('The maximum number of results to return. Default is 20.')
    .optional(),
});
