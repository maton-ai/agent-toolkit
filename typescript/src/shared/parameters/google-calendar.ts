import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createEventParameters = z.object({
  calendar_id: z.string().describe('The ID of Google Calendar'),
  event_start_date: z
    .string()
    .describe(
      'The start date of the event in the format `yyyy-mm-dd`. For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to RFC3339: `yyyy-mm-ddThh:mm:ss+01:00`.'
    ),
  event_end_date: z
    .string()
    .describe(
      'The start date of the event in the format `yyyy-mm-dd`. For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to RFC3339: `yyyy-mm-ddThh:mm:ss+01:00`.'
    ),
  summary: z.string().describe('The title of the event.').optional(),
  location: z.string().describe('The location of the event.').optional(),
  description: z.string().describe('The description of the event.').optional(),
  attendees: z
    .array(z.string())
    .describe('The email addresses of the attendees.')
    .optional(),
  repeat_frequency: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .describe('The frequency of the event repetition.')
    .optional(),
  repeat_times: z
    .number()
    .describe('The number of times the event repeats.')
    .optional(),
  repeat_interval: z
    .number()
    .describe(
      'The interval between event repetitions. To repeat every day, enter 1. To repeat every other day, enter 2.'
    )
    .optional(),
  send_updates: z
    .enum(['all', 'externalOnly', 'none'])
    .describe('Whether to send updates.')
    .optional(),
  create_meet_room: z
    .boolean()
    .describe('Whether to create a Google Meet room for this event.')
    .optional(),
  visibility: z
    .enum(['default', 'public', 'private', 'confidential'])
    .describe(
      'The visibility of the event. Defaults to default if not specified.'
    )
    .optional(),
});

export const deleteEventParameters = z.object({
  calendar_id: z.string().describe('The ID of calendar'),
  event_id: z.string().describe('The ID of event'),
});

export const getCalendarParameters = z.object({
  calendar_id: z.string().describe('The ID of Google Calendar'),
});

export const getEventParameters = z.object({
  calendar_id: z.string().describe('The ID of calendar'),
  event_id: z.string().describe('The ID of event'),
});

export const listCalendarsParameters = z.object({});

export const listEventsParameters = z.object({
  calendar_id: z.string().describe('The ID of calendar'),
  order_by: z
    .enum(['startTime', 'updated'])
    .describe('The order of the events returned in the result.')
    .optional(),
  q: z.string().describe('The search query.').optional(),
  show_deleted: z
    .boolean()
    .describe(
      'Whether to include deleted events (with status equals "cancelled") in the result.'
    )
    .optional(),
  show_hidden_invitations: z
    .boolean()
    .describe('Whether to include hidden invitations in the result.')
    .optional(),
  show_single_events: z
    .boolean()
    .describe(
      'Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves.'
    )
    .optional(),
  time_max: z
    .string()
    .describe("Upper bound (exclusive) for an event's time to filter by.")
    .optional(),
  time_min: z
    .string()
    .describe("Lower bound (exclusive) for an event's time to filter by.")
    .optional(),
  updated_min: z
    .string()
    .describe("Lower bound for an event's last modification time to filter by.")
    .optional(),
  event_types: z
    .array(z.enum(['default', 'focusTime', 'outOfOffice', 'workingLocation']))
    .describe('Filter events by event type.')
    .optional(),
});

export const updateEventParameters = z.object({
  calendar_id: z.string().describe('The ID of calendar'),
  event_id: z.string().describe('The ID of event'),
  summary: z.string().describe('The title of the event.').optional(),
  event_start_date: z
    .string()
    .describe(
      'The start date of the event in the format `yyyy-mm-dd`. For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to RFC3339: `yyyy-mm-ddThh:mm:ss+01:00`.'
    )
    .optional(),
  event_end_date: z
    .string()
    .describe(
      'The start date of the event in the format `yyyy-mm-dd`. For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to RFC3339: `yyyy-mm-ddThh:mm:ss+01:00`.'
    )
    .optional(),
  location: z.string().describe('The location of the event.').optional(),
  description: z.string().describe('The description of the event.').optional(),
  attendees: z
    .array(z.string())
    .describe('The email addresses of the attendees.')
    .optional(),
  repeat_frequency: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .describe('The frequency of the event repetition.')
    .optional(),
  repeat_times: z
    .number()
    .describe('The number of times the event repeats.')
    .optional(),
  repeat_interval: z
    .number()
    .describe(
      'The interval between event repetitions. To repeat every day, enter 1. To repeat every other day, enter 2.'
    )
    .optional(),
  send_updates: z
    .enum(['all', 'externalOnly', 'none'])
    .describe('Whether to send updates.')
    .optional(),
  create_meet_room: z
    .boolean()
    .describe('Whether to create a Google Meet room for this event.')
    .optional(),
  visibility: z
    .enum(['default', 'public', 'private', 'confidential'])
    .describe('The visibility of the event.')
    .optional(),
});
