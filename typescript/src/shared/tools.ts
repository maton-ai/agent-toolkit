import {z} from 'zod';

import {
  checkConnectionPrompt as hubspotCheckConnectionPrompt,
  startConnectionPrompt as hubspotStartConnectionPrompt,
  transferAgentPrompt as hubspotTransferAgentPrompt,
  createContactPrompt as hubspotCreateContactPrompt,
  getContactPrompt as hubspotGetContactPrompt,
  listContactsPrompt as hubspotListContactsPrompt,
  searchContactsPrompt as hubspotSearchContactsPrompt,
  mergeContactsPrompt as hubspotMergeContactsPrompt,
  updateContactPrompt as hubspotUpdateContactPrompt,
  deleteContactPrompt as hubspotDeleteContactPrompt,
  createDealPrompt as hubspotCreateDealPrompt,
  getDealPrompt as hubspotGetDealPrompt,
  listDealsPrompt as hubspotListDealsPrompt,
  searchDealsPrompt as hubspotSearchDealsPrompt,
  mergeDealPrompt as hubspotMergeDealPrompt,
  updateDealPrompt as hubspotUpdateDealPrompt,
  deleteDealPrompt as hubspotDeleteDealPrompt,
} from './prompts/hubspot';
import {
  checkConnectionPrompt as salesforceCheckConnectionPrompt,
  startConnectionPrompt as salesforceStartConnectionPrompt,
  transferAgentPrompt as salesforceTransferAgentPrompt,
  createContactPrompt as salesforceCreateContactPrompt,
  getContactPrompt as salesforceGetContactPrompt,
  listContactsPrompt as salesforceListContactsPrompt,
} from './prompts/salesforce';

import {
  checkConnectionParameters as hubspotCheckConnectionParameters,
  startConnectionParameters as hubspotStartConnectionParameters,
  transferAgentParameters as hubspotTransferAgentParameters,
  createContactParameters as hubspotCreateContactParameters,
  getContactParameters as hubspotGetContactParameters,
  listContactsParameters as hubspotListContactsParameters,
  searchContactsParameters as hubspotSearchContactsParameters,
  mergeContactsParameters as hubspotMergeContactsParameters,
  updateContactParameters as hubspotUpdateContactParameters,
  deleteContactParameters as hubspotDeleteContactParameters,
  createDealParameters as hubspotCreateDealParameters,
  getDealParameters as hubspotGetDealParameters,
  listDealsParameters as hubspotListDealsParameters,
  searchDealsParameters as hubspotSearchDealsParameters,
  mergeDealParameters as hubspotMergeDealParameters,
  updateDealParameters as hubspotUpdateDealParameters,
  deleteDealParameters as hubspotDeleteDealParameters,
} from './parameters/hubspot';
import {
  checkConnectionParameters as salesforceCheckConnectionParameters,
  startConnectionParameters as salesforceStartConnectionParameters,
  transferAgentParameters as salesforceTransferAgentParameters,
  createContactParameters as salesforceCreateContactParameters,
  getContactParameters as salesforceGetContactParameters,
  listContactsParameters as salesforceListContactsParameters,
} from './parameters/salesforce';

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

const tools: Tool[] = [
  {
    method: 'hubspot_check_connection',
    name: 'HubSpot Check Connection',
    description: hubspotCheckConnectionPrompt,
    parameters: hubspotCheckConnectionParameters,
    actions: {},
  },
  {
    method: 'hubspot_start_connection',
    name: 'HubSpot Start Connection',
    description: hubspotStartConnectionPrompt,
    parameters: hubspotStartConnectionParameters,
    actions: {},
  },
  {
    method: 'hubspot_transfer_agent',
    name: 'HubSpot Transfer Agent',
    description: hubspotTransferAgentPrompt,
    parameters: hubspotTransferAgentParameters,
    actions: {},
  },
  {
    method: 'hubspot_create_contact',
    name: 'HubSpot Create Contact',
    description: hubspotCreateContactPrompt,
    parameters: hubspotCreateContactParameters,
    actions: {},
  },
  {
    method: 'hubspot_get_contact',
    name: 'HubSpot Get Contact',
    description: hubspotGetContactPrompt,
    parameters: hubspotGetContactParameters,
    actions: {},
  },
  {
    method: 'hubspot_list_contacts',
    name: 'HubSpot List Contacts',
    description: hubspotListContactsPrompt,
    parameters: hubspotListContactsParameters,
    actions: {},
  },
  {
    method: 'hubspot_search_contacts',
    name: 'HubSpot Search Contacts',
    description: hubspotSearchContactsPrompt,
    parameters: hubspotSearchContactsParameters,
    actions: {},
  },
  {
    method: 'hubspot_merge_contacts',
    name: 'HubSpot Merge Contacts',
    description: hubspotMergeContactsPrompt,
    parameters: hubspotMergeContactsParameters,
    actions: {},
  },
  {
    method: 'hubspot_update_contact',
    name: 'HubSpot Update Contact',
    description: hubspotUpdateContactPrompt,
    parameters: hubspotUpdateContactParameters,
    actions: {},
  },
  {
    method: 'hubspot_delete_contact',
    name: 'HubSpot Delete Contact',
    description: hubspotDeleteContactPrompt,
    parameters: hubspotDeleteContactParameters,
    actions: {},
  },
  {
    method: 'hubspot_create_deal',
    name: 'HubSpot Create Deal',
    description: hubspotCreateDealPrompt,
    parameters: hubspotCreateDealParameters,
    actions: {},
  },
  {
    method: 'hubspot_get_deal',
    name: 'HubSpot Get Deal',
    description: hubspotGetDealPrompt,
    parameters: hubspotGetDealParameters,
    actions: {},
  },
  {
    method: 'hubspot_list_deals',
    name: 'HubSpot List Deals',
    description: hubspotListDealsPrompt,
    parameters: hubspotListDealsParameters,
    actions: {},
  },
  {
    method: 'hubspot_search_deals',
    name: 'HubSpot Search Deals',
    description: hubspotSearchDealsPrompt,
    parameters: hubspotSearchDealsParameters,
    actions: {},
  },
  {
    method: 'hubspot_merge_deals',
    name: 'HubSpot Merge Deals',
    description: hubspotMergeDealPrompt,
    parameters: hubspotMergeDealParameters,
    actions: {},
  },
  {
    method: 'hubspot_update_deal',
    name: 'HubSpot Update Deal',
    description: hubspotUpdateDealPrompt,
    parameters: hubspotUpdateDealParameters,
    actions: {},
  },
  {
    method: 'hubspot_delete_deal',
    name: 'HubSpot Delete Deal',
    description: hubspotDeleteDealPrompt,
    parameters: hubspotDeleteDealParameters,
    actions: {},
  },
  {
    method: 'salesforce_check_connection',
    name: 'Salesforce Check Connection',
    description: salesforceCheckConnectionPrompt,
    parameters: salesforceCheckConnectionParameters,
    actions: {},
  },
  {
    method: 'salesforce_start_connection',
    name: 'Salesforce Start Connection',
    description: salesforceStartConnectionPrompt,
    parameters: salesforceStartConnectionParameters,
    actions: {},
  },
  {
    method: 'salesforce_transfer_agent',
    name: 'Salesforce Transfer Agent',
    description: salesforceTransferAgentPrompt,
    parameters: salesforceTransferAgentParameters,
    actions: {},
  },
  {
    method: 'salesforce_create_contact',
    name: 'Salesforce Create Contact',
    description: salesforceCreateContactPrompt,
    parameters: salesforceCreateContactParameters,
    actions: {},
  },
  {
    method: 'salesforce_get_contact',
    name: 'Salesforce Get Contact',
    description: salesforceGetContactPrompt,
    parameters: salesforceGetContactParameters,
    actions: {},
  },
  {
    method: 'salesforce_list_contacts',
    name: 'Salesforce List Contacts',
    description: salesforceListContactsPrompt,
    parameters: salesforceListContactsParameters,
    actions: {},
  },
];

export default tools;
