import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createContactParameters = z.object({
  first_name: z.string().describe('The first name of the contact'),
  last_name: z.string().describe('The last name of the contact'),
  description: z.string().optional().describe('The description of the contact'),
  email: z.string().email().optional().describe('The email of the contact'),
  phone: z.string().optional().describe('The phone number of the contact'),
});

export const getContactParameters = z.object({
  contact_id: z.string().describe('The ID of the contact'),
});

export const listContactsParameters = z.object({});
