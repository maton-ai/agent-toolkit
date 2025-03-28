import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const appendTextParameters = z.object({
  doc_id: z.string().describe('The ID of Google document'),
  text: z.string().describe('The text of Google document'),
});

export const createDocumentParameters = z.object({
  title: z.string().describe('The title of Google document'),
  text: z.string().describe('The text of Google document'),
});

export const findDocumentParameters = z.object({
  q: z.string().describe('The search query'),
});

export const getDocumentParameters = z.object({
  doc_id: z.string().describe('The ID of Google document'),
});
