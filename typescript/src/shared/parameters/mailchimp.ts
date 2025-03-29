import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const getCampaignParameters = z.object({
  campaign_id: z.string().describe('The ID of the campaign'),
});

export const searchCampaignsParameters = z.object({
  q: z.string().describe('The search query'),
});
