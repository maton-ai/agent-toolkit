import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createFileParameters = z.object({
  content: z.string().describe('The text content of the file to create'),
  mime_type: z.string().describe('The MIME type of the file to create'),
  name: z.string().optional().describe('The name of the file to create'),
  parent_id: z
    .string()
    .optional()
    .describe('The ID of the parent folder to create the file in'),
});

export const createFolderParameters = z.object({
  parent_id: z
    .string()
    .describe('The ID of the parent folder to create the folder in'),
});

export const deleteFileParameters = z.object({
  file_id: z.string().describe('The ID of the file to delete'),
});

export const findFileParameters = z.object({
  q: z.string().describe('The search query'),
});

export const findFolderParameters = z.object({
  q: z.string().describe('The search query'),
  include_trashed: z
    .boolean()
    .optional()
    .describe('Whether to include trashed folders'),
});

export const getFileParameters = z.object({
  file_id: z.string().describe('The ID of the file to retrieve'),
});

export const listFilesParameters = z.object({
  folder_id: z.string().optional().describe('The ID of folder'),
});
