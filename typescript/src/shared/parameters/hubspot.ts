import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

const associationTypesSchema = z.object({
  association_category: z.literal('HUBSPOT_DEFINED'),
  association_type_id: z.union([
    z.literal(279), // Contact to Company
    z.literal(449), // Contact to Contact
    z.literal(4), // Contact to Deal
    z.literal(15), // Contact to Ticket
    z.literal(341), // Deal to Company
    z.literal(3), // Deal to Contact
    z.literal(451), // Deal to Deal
    z.literal(27), // Deal to Ticket
  ]),
});

const associationSchema = z.object({
  types: z.array(associationTypesSchema).optional(),
  to: z.string().optional(),
});

const contactPropertiesSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  mobilephone: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  jobtitle: z.string().optional(),
  industry: z.string().optional(),
  lifecyclestage: z
    .union([
      z.literal('subscriber'),
      z.literal('lead'),
      z.literal('marketingqualifiedlead'),
      z.literal('salesqualifiedlead'),
      z.literal('opportunity'),
      z.literal('customer'),
      z.literal('evangelist'),
      z.literal('other'),
    ])
    .optional(),
});

export const createContactParameters = z.object({
  associations: z.array(associationSchema).optional(),
  properties: contactPropertiesSchema.optional(),
});

export const getContactParameters = z.object({
  contact_id: z.string().describe('The ID of the contact'),
});

export const listContactsParameters = z.object({
  limit: z
    .number()
    .optional()
    .default(100)
    .describe(
      'The maximum number of results to display per page. Default: 100. Maximum: 100.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.'
    ),
  properties: z
    .array(z.string())
    .optional()
    .describe(
      'List of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored.'
    ),
  associations: z
    .array(z.string())
    .optional()
    .describe(
      'List of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored.'
    ),
  archived: z
    .boolean()
    .optional()
    .describe('Whether to return only results that have been archived.'),
});

export const searchContactsParameters = z.object({
  query: z.string().optional().describe('The query of the search.'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(200)
    .default(200)
    .describe(
      'The maximum number of results to display per page. Default: 200. Maximum: 200.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.'
    ),
  sorts: z
    .array(
      z.object({
        propertyName: z.string().describe('The name of the property.'),
        direction: z
          .enum(['ASCENDING', 'DESCENDING'])
          .describe('The direction of the sort.'),
      })
    )
    .optional()
    .describe('List of sorts containing the following keys:'),
  properties: z
    .array(z.string())
    .optional()
    .describe(
      'List of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored.'
    ),
  filter_groups: z
    .array(
      z.object({
        filters: z
          .array(
            z.object({
              high_value: z
                .string()
                .optional()
                .describe('The maximum value of a range.'),
              property_name: z
                .string()
                .optional()
                .describe('The name of the property.'),
              values: z
                .array(z.string())
                .optional()
                .describe('List of values to compare.'),
              value: z.string().optional().describe('The value to compare.'),
              operator: z
                .enum([
                  'IN',
                  'NOT_HAS_PROPERTY',
                  'LT',
                  'EQ',
                  'GT',
                  'NOT_IN',
                  'GTE',
                  'CONTAINS_TOKEN',
                  'HAS_PROPERTY',
                  'LTE',
                  'NOT_CONTAINS_TOKEN',
                  'BETWEEN',
                  'NEQ',
                ])
                .optional()
                .describe('The operator of the filter. Possible values are:'),
            })
          )
          .optional()
          .describe('List of filters containing the following keys'),
      })
    )
    .optional()
    .describe('List of filter groups containing the following keys.'),
});

export const mergeContactsParameters = z.object({
  object_id_to_merge: z.string({
    description: 'The ID of the object to merge.',
  }),
  primary_object_id: z.string({
    description: 'The ID of the primary object of the merge.',
  }),
});

export const updateContactParameters = z.object({
  contact_id: z.string(),
  properties: z.optional(
    z.object({
      firstname: z.optional(z.string()),
      lastname: z.optional(z.string()),
      email: z.optional(z.string()),
      company: z.optional(z.string()),
      website: z.optional(z.string()),
      mobilephone: z.optional(z.string()),
      phone: z.optional(z.string()),
      fax: z.optional(z.string()),
      address: z.optional(z.string()),
      city: z.optional(z.string()),
      state: z.optional(z.string()),
      zip: z.optional(z.string()),
      country: z.optional(z.string()),
      jobtitle: z.optional(z.string()),
      industry: z.optional(z.string()),
      lifecyclestage: z.optional(
        z.enum([
          'subscriber',
          'lead',
          'marketingqualifiedlead',
          'salesqualifiedlead',
          'opportunity',
          'customer',
          'evangelist',
          'other',
        ])
      ),
    })
  ),
});

export const deleteContactParameters = z.object({
  contact_id: z.string().describe('The ID of the contact'),
});

const dealPropertiesSchema = z.object({
  dealname: z.string(),
  dealstage: z.enum([
    'appointmentscheduled',
    'qualifiedtobuy',
    'presentationscheduled',
    'decisionmakerboughtin',
    'contractsent',
    'closedwon',
    'closedlost',
  ]),
  amount: z.number().optional(),
  closed_lost_reason: z.string().optional(),
  closed_won_reason: z.string().optional(),
  closedate: z.date().optional(),
  createdate: z.date().optional(),
  dealtype: z.enum(['newbusiness', 'existingbusiness']).optional(),
  description: z.string().optional(),
  hs_priority: z.enum(['low', 'medium', 'high']).optional(),
  pipeline: z.enum(['default']).optional(),
});

export const createDealParameters = z.object({
  associations: z.array(associationSchema).optional(),
  properties: dealPropertiesSchema.optional(),
});

export const getDealParameters = z.object({
  deal_id: z.string().describe('The ID of the deal'),
});

export const listDealsParameters = z.object({
  limit: z
    .number()
    .optional()
    .describe(
      'The maximum number of results to display per page. Default: 100. Maximum: 100.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.'
    ),
  properties: z
    .array(z.string())
    .optional()
    .describe(
      'List of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored.'
    ),
  associations: z
    .array(z.string())
    .optional()
    .describe(
      'List of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored.'
    ),
  archived: z
    .boolean()
    .optional()
    .describe('Whether to return only results that have been archived.'),
});

export const searchDealsParameters = z.object({
  query: z.string().optional(),
  limit: z.number().optional().default(200),
  after: z.string().optional(),
  sorts: z
    .array(
      z.object({
        propertyName: z.string(),
        direction: z.union([z.literal('ASCENDING'), z.literal('DESCENDING')]),
      })
    )
    .optional(),
  properties: z.array(z.string()).optional(),
  filter_groups: z
    .array(
      z.object({
        filters: z
          .array(
            z.object({
              high_value: z.string().optional(),
              property_name: z.string().optional(),
              values: z.array(z.string()).optional(),
              value: z.string().optional(),
              operator: z.union([
                z.literal('IN'),
                z.literal('NOT_HAS_PROPERTY'),
                z.literal('LT'),
                z.literal('EQ'),
                z.literal('GT'),
                z.literal('NOT_IN'),
                z.literal('GTE'),
                z.literal('CONTAINS_TOKEN'),
                z.literal('HAS_PROPERTY'),
                z.literal('LTE'),
                z.literal('NOT_CONTAINS_TOKEN'),
                z.literal('BETWEEN'),
                z.literal('NEQ'),
              ]),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export const mergeDealParameters = z.object({
  object_id_to_merge: z.string().describe('The ID of the object to merge.'),
  primary_object_id: z
    .string()
    .describe('The ID of the primary object of the merge.'),
});

export const updateDealParameters = z.object({
  deal_id: z.string().describe('The ID of the deal.'),
  properties: z
    .object({
      firstname: z
        .string()
        .optional()
        .describe('The first name of the contact.'),
      lastname: z.string().optional().describe('The last name of the contact.'),
      email: z
        .string()
        .optional()
        .describe('The email address of the contact.'),
      company: z.string().optional().describe('The company of the contact.'),
      website: z.string().optional().describe('The website of the contact.'),
      mobilephone: z
        .string()
        .optional()
        .describe('The mobile phone number of the contact.'),
      phone: z.string().optional().describe('The phone number of the contact.'),
      fax: z.string().optional().describe('The fax number of the contact.'),
      address: z.string().optional().describe('The address of the contact.'),
      city: z.string().optional().describe('The city of the contact.'),
      state: z.string().optional().describe('The state of the contact.'),
      zip: z.string().optional().describe('The zip code of the contact.'),
      country: z.string().optional().describe('The country of the contact.'),
      jobtitle: z.string().optional().describe('The job title of the contact.'),
      industry: z.string().optional().describe('The industry of the contact.'),
      lifecyclestage: z
        .enum([
          'subscriber',
          'lead',
          'marketingqualifiedlead',
          'salesqualifiedlead',
          'opportunity',
          'customer',
          'evangelist',
          'other',
        ])
        .optional()
        .describe('The lifecycle stage of the contact.'),
    })
    .optional(),
});

export const deleteDealParameters = z.object({
  deal_id: z.string().describe('The ID of the deal'),
});
