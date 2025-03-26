import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const addProfilesToListParameters = z.object({
  list_id: z.string().describe('The list ID'),
  profile_ids: z.array(z.string()).describe('A list of profile IDs'),
});

export const assignTemplateToCampaignMessageParameters = z.object({
  campaign_message_id: z.string().describe('The ID of the campaign message'),
  template_id: z.string().describe('The ID of the template'),
});

export const createCampaignParameters = z.object({
  name: z.string().describe('The name of the campaign'),
  audiences: z.object({
    included: z.array(z.string()).describe('The IDs of included lists'),
    excluded: z.array(z.string()).describe('The IDs of excluded lists'),
  }),
  campaign_messages: z.array(
    z
      .object({
        type: z.enum(['campaign-message']),
        attributes: z
          .object({
            definition: z
              .object({
                channel: z
                  .enum(['email', 'sms', 'mobile_push'])
                  .describe('The channel of the campaign message.'),
                label: z
                  .string()
                  .optional()
                  .describe('The label of the campaign message.'),
                content: z
                  .object({
                    subject: z
                      .string()
                      .optional()
                      .describe('The subject of the campaign message.'),
                    previewText: z
                      .string()
                      .optional()
                      .describe('The preview text of the campaign message.'),
                    fromEmail: z
                      .string()
                      .optional()
                      .describe('The from email of the campaign message.'),
                    fromLabel: z
                      .string()
                      .optional()
                      .describe('The from label of the campaign message.'),
                    replyToEmail: z
                      .string()
                      .optional()
                      .describe('The reply to email of the campaign message.'),
                    ccEmail: z
                      .string()
                      .optional()
                      .describe('The cc email of the campaign message.'),
                    bccEmail: z
                      .string()
                      .optional()
                      .describe('The bcc email of the campaign message.'),
                  })
                  .optional(),
                renderOptions: z
                  .object({
                    shortenLinks: z
                      .boolean()
                      .optional()
                      .describe('Whether to shorten links.'),
                    addOrgPrefix: z
                      .boolean()
                      .optional()
                      .describe('Whether to add org prefix.'),
                    addInfoLinks: z
                      .boolean()
                      .optional()
                      .describe('Whether to add info links.'),
                    addOptOutLanguage: z
                      .boolean()
                      .optional()
                      .describe('Whether to add opt out language.'),
                  })
                  .optional(),
                kvPairs: z
                  .object({})
                  .optional()
                  .describe('The kv pairs of the campaign message.'),
                options: z
                  .object({
                    type: z
                      .enum(['open_app', 'deep_link'])
                      .describe('The type of the options.'),
                    iosDeepLink: z
                      .string()
                      .optional()
                      .describe('The ios deep link of the campaign message.'),
                    androidDeepLink: z
                      .string()
                      .optional()
                      .describe(
                        'The android deep link of the campaign message.'
                      ),
                    display: z
                      .boolean()
                      .optional()
                      .describe(
                        'Whether to display the campaign message. Required if type is "open_app".'
                      ),
                  })
                  .optional()
                  .describe('The options of the campaign message.'),
              })
              .describe('The definition of the campaign message.'),
          })
          .describe('THe attributes of the campaign message.'),
      })
      .describe('The data of the campaign message.')
  ),
  send_strategy: z
    .object({
      method: z
        .enum(['static', 'throttled', 'immediate', 'smart_send_time'])
        .describe('The method of the send strategy.'),
      datetime: z
        .string()
        .optional()
        .describe(
          'The ISO 8601 date and time of the send time. Requred if method is "static".'
        ),
      options: z
        .object({
          isLocalTime: z.boolean().describe('Whether to use local time'),
          sendPastRecipientsImmediately: z
            .boolean()
            .optional()
            .describe('Whether to send past recipients immediately.'),
        })
        .optional()
        .describe('The options of the send strategy.'),
      throttlePercentage: z
        .number()
        .optional()
        .describe(
          'The throttle percentage of the send strategy. Required if method is "throttled"'
        ),
      date: z
        .string()
        .optional()
        .describe(
          'The ISO 8601 date of the send time. Required if method is "smart_send_time"'
        ),
    })
    .optional()
    .describe('The send strategy of the campaign.'),
  send_options: z
    .object({
      useSmartSending: z
        .boolean()
        .optional()
        .describe('Whether to use smart sending.'),
    })
    .optional()
    .describe('The send options of the campaign.'),
  tracking_options: z
    .object({
      addTrackingParams: z
        .boolean()
        .optional()
        .describe('Whether to add tracking params.'),
      customTrackingParams: z
        .array(
          z.object({
            type: z
              .enum(['static', 'dynamic'])
              .describe('The type of the custom tracking param.'),
            value: z
              .string()
              .describe('The value of the custom tracking param.'),
            name: z.string().describe('The name of the custom tracking param.'),
          })
        )
        .optional()
        .describe('The custom tracking params of the campaign.'),
      isTrackingClicks: z
        .boolean()
        .optional()
        .describe('Whether to track clicks.'),
      isTrackingOpens: z
        .boolean()
        .optional()
        .describe('Whether to track opens.'),
    })
    .optional()
    .describe('The tracking options of the campaign.'),
});

export const createListParameters = z.object({
  name: z.string().describe('The name of the list.'),
});

export const createProfileParameters = z.object({
  email: z.string().optional().describe('The email of the user.'),
  phone_number: z.string().optional().describe('The phone number of the user.'),
  external_id: z.string().optional().describe('The external ID of the user.'),
  first_name: z.string().optional().describe('The first name of the user.'),
  last_name: z.string().optional().describe('The last name of the user.'),
  organization: z.string().optional().describe('The organization of the user.'),
  locale: z.string().optional().describe('The locale of the user.'),
  title: z.string().optional().describe('The title of the user.'),
  image: z.string().optional().describe('The image of the user.'),
  location: z.string().optional().describe('The location of the user.'),
  properties: z.object({}).optional().describe('The properties of the user.'),
});

export const createTemplateParameters = z.object({
  name: z.string().describe('The name of the template.'),
  html: z.string().optional().describe('The HTML content of the template.'),
  text: z.string().optional().describe('The text content of the template.'),
});

export const getCampaignMessagesParameters = z.object({
  campaign_id: z.string().describe('The ID of the campaign.'),
});

export const getCampaignSendJobParameters = z.object({
  campaign_id: z.string().describe('The ID of the campaign.'),
});

export const getCampaignsParameters = z.object({
  filter: z
    .string()
    .describe(
      "The filter of the campaigns. A channel filter is required to list campaigns. Please provide either:\n`equals(messages.channel,'email')` to list email campaigns, `equals(messages.channel,'sms')` to list SMS campaigns, `equals(messages.channel,'mobile_push')` to list mobile push campaigns."
    ),
});

export const getListsParameters = z.object({});

export const getProfilesForListParameters = z.object({
  list_id: z.string().describe('The list ID.'),
});

export const getProfilesParameters = z.object({});

export const getTemplatesParameters = z.object({});

export const sendCampaignParameters = z.object({
  campaign_id: z.string().describe('The ID of the campaign.'),
});
