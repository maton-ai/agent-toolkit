import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const listVideosParameters = z.object({
  part: z
    .array(
      z.enum([
        'auditDetails',
        'brandingSettings',
        'contentDetails',
        'contentOwnerDetails',
        'id',
        'localizations',
        'snippet',
        'statistics',
        'status',
        'topicDetails',
      ])
    )
    .describe(
      'The part parameter specifies a comma-separated list of one or more resource properties that the API response will include. Possible values are: auditDetails, brandingSettings, contentDetails, contentOwnerDetails, id, localizations, snippet, statistics, status, topicDetails'
    ),
  use_case: z
    .enum(['id', 'myRating', 'chart'])
    .describe(
      'The useCase parameter specifies the type of resource to be returned. Possible values are: id, myRating, chart'
    ),
  video_ids: z
    .array(z.enum(['id', 'myRating', 'chart']))
    .optional()
    .describe(
      'The id parameter specifies a comma-separated list of the YouTube video ID(s) for the resource(s) that are being retrieved.'
    ),
  my_rating: z
    .enum(['like', 'dislike'])
    .optional()
    .describe(
      'The myRating parameter specifies the rating of the authenticated user. Possible values are: like, dislike'
    ),
  region_code: z
    .string()
    .optional()
    .describe(
      'The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR'
    ),
  max_results: z
    .number()
    .optional()
    .describe(
      'The maxResults parameter specifies the maximum number of items that should be returned in the result set. Default: 20.'
    ),
});

export const searchVideosParameters = z.object({
  q: z.string().describe('The search query'),
  max_results: z
    .number()
    .optional()
    .describe('The maximum number of results to return. Default: 20.'),
});
