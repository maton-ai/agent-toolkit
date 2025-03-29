import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const listChannelsParameters = z.object({});

export const listMessagesParameters = z.object({
  channel_id: z.string().describe('The ID of channel'),
});

export const listRepliesParameters = z.object({
  channel_id: z.string().describe('The ID of channel'),
  ts: z.string().describe('The timestamp of the message'),
});

export const sendMessageParameters = z.object({
  channel_id: z.string().describe('The ID of channel'),
  text: z.string().describe('The text of the message'),
});
