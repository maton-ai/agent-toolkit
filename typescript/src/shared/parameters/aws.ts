import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const getS3ObjectParameters = z.object({
  bucket_name: z.string().describe('The name of the S3 bucket'),
  object_key: z.string().describe('The key of the S3 object'),
});

export const listS3BucketsParameters = z.object({});

export const listS3ObjectsParameters = z.object({
  bucket_name: z.string().describe('The name of the S3 bucket'),
});
