import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const listCloudsParameters = z.object({});

export const getIssueParameters = z.object({
  cloud_id: z.string().describe('The ID of the cloud'),
  issue_id: z.string().describe('The ID of the issue'),
});

export const listIssuesParameters = z.object({
  cloud_id: z.string().describe('The ID of the cloud'),
});

export const addCommentToIssueParameters = z.object({
  cloud_id: z.string().describe('The ID of the cloud'),
  issue_id: z.string().describe('The ID of the issue'),
  comment: z.string().describe('The comment to add to the issue'),
});

export const listCommentsParameters = z.object({
  cloud_id: z.string().describe('The ID of the cloud'),
  issue_id: z.string().describe('The ID of the issue'),
});

export const updateCommentParameters = z.object({
  cloud_id: z.string().describe('The ID of the cloud'),
  issue_id: z.string().describe('The ID of the issue'),
  comment_id: z.string().describe('The ID of the comment'),
  comment: z.string().describe('The new comment'),
});

export const listProjectsParameters = z.object({
  cloud_id: z.string().describe('The ID of the cloud'),
});

export const getUserParameters = z.object({
  account_id: z.string().describe('The ID of the user account'),
});

export const listUsersParameters = z.object({
  cloud_id: z.string().describe('The ID of the cloud'),
});
