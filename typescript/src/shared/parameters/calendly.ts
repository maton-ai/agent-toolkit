import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const getEventParameters = z.object({
  event_id: z.string().describe('The ID of the event'),
});

export const listEventInviteesParameters = z.object({
  event_id: z.string().describe('The ID of the event'),
});

export const listEventTypesParameters = z.object({});

export const listEventsParameters = z.object({
  invitee: z.string().describe('The email address of the invitee').optional(),
  status: z
    .enum(['active', 'cancelled'])
    .describe('The status of the event')
    .optional(),
  max_results: z
    .number()
    .describe('The maximum number of results to return. Default: 20.')
    .optional(),
});
