import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const listFormsParameters = z.object({});

export const listSubmissionsParameters = z.object({
  form_id: z.string().describe('The ID of form'),
});
