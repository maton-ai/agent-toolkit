import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const getFormParameters = z.object({
  form_id: z.string().describe('The ID of the form'),
});

export const listFormsParameters = z.object({
  q: z.string().describe('The search query').optional(),
  page: z.number().describe('The page number').optional(),
  per_page: z.number().describe('The number of items per page').optional(),
});

export const listResponsesParameters = z.object({
  form_id: z.string().describe('The ID of the form'),
  sort: z
    .string()
    .describe(
      'Responses order in {fieldID},{asc|desc} format. You can use built-in submitted_at/staged_at/landed_at field IDs or any field ID from your typeform, possible directions are asc/desc. Default value is submitted_at,desc for completed responses, staged_at,desc for partial responses and landed_at,desc for started responses.'
    ).optional(),
  q: z.string().describe('The search query').optional(),
  per_page: z.number().describe('The number of items per page').optional(),
});
