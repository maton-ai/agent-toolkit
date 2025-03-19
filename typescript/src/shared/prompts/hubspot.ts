export const checkConnectionPrompt = `
Check if there is any active connection to the salesforce app.
`;

export const startConnectionPrompt = `
Start a connection to the salesforce app. Active connections are required to perform actions with the app.
`;

export const transferAgentPrompt = `
Transfer to the HubSpot agent.
`;

export const createContactPrompt = `
Create a contact. Object properties should include at least one of the following properties: email, firstname, or lastname. It is recommended to always include email, because email address is the primary unique identifier to avoid duplicate contacts in HubSpot.
`;

export const getContactPrompt = `
Get a contact.
`;

export const listContactsPrompt = `
List all contacts, using query parameters to control the information that gets returned.
`;

export const searchContactsPrompt = `
Search for contacts by filtering on properties, searching through associations, and sorting results. To apply OR logic for filters, include multiple filters within a filter group. To apply AND logic for filters, include a list of conditions within one set of filters.
`;

export const mergeContactsPrompt = `
Merge two contacts.
`;

export const updateContactPrompt = `
Update a contact. Provided property values will be overwritten. Properties values can be cleared by passing an empty string.
`;

export const deleteContactPrompt = `
Delete a contact.
`;

export const createDealPrompt = `
Create a deal. Object properties should include the following properties: dealname, dealstage, and if you have multiple pipelines, pipeline. If a pipeline isn't specified, the default pipeline will be used.
`;

export const getDealPrompt = `
Get a deal.
`;

export const listDealsPrompt = `
List all deals, using query parameters to control the information that gets returned.
`;

export const searchDealsPrompt = `
Search for deals by filtering on properties, searching through associations, and sorting results. To apply OR logic for filters, include multiple filters within a filter group. To apply AND logic for filters, include a list of conditions within one set of filters.
`;

export const mergeDealPrompt = `
Merge two deals.
`;

export const updateDealPrompt = `
Update a deal. Provided property values will be overwritten. Properties values can be cleared by passing an empty string.
`;

export const deleteDealPrompt = `
Delete a deal.
`;
