import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createTaskParameters = z.object({
  project_id: z.string().describe('The project ID'),
  name: z.string().describe('Name of the task'),
  assignee: z.string().describe('The email of the user').optional(),
  completed: z
    .boolean()
    .describe('True if the task is currently marked complete, false if not')
    .optional(),
  due_at: z
    .string()
    .describe(
      'The UTC date and time on which this task is due, or null if the task has no due time. This takes an ISO 8601 date string in UTC and should not be used together with due_on.'
    )
    .optional(),
  notes: z
    .string()
    .describe('Free-form textual information associated with the task'),
});

export const getTaskParameters = z.object({
  task_id: z.string().describe('The task ID'),
});

export const listProjectsParameters = z.object({
  workspace_id: z.string().describe('The workspace ID'),
});

export const listTasksParameters = z.object({
  project_id: z.string().describe('The project ID'),
});

export const listWorkspacesParameters = z.object({});
