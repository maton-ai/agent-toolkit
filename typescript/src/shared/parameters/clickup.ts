import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createTaskParameters = z.object({
  list_id: z.string().describe('The ID of the list'),
  name: z.string().describe('Name of the task'),
  description: z.string().describe('Description of the task'),
  priority: z
    .enum(['Low', 'Medium', 'High', 'Urgent'])
    .describe('Priority of the task'),
  assignees: z.array(z.string()).describe('List of assignees'),
  due_date: z.string().describe('Due date of the task').optional(),
});

export const deleteTaskParameters = z.object({
  task_id: z.string().describe('The ID of the task'),
});

export const getTaskParameters = z.object({
  task_id: z.string().describe('The ID of the task'),
});

export const listFoldersParameters = z.object({
  space_id: z.string().describe('The ID of the space'),
});

export const listListsParameters = z.object({
  folder_id: z.string().describe('The ID of the folder'),
});

export const listSpacesParameters = z.object({
  workspace_id: z.string().describe('The ID of the workspace'),
});

export const listTasksParameters = z.object({
  list_id: z.string().describe('The ID of the list'),
});

export const listWorkspacesParameters = z.object({});
