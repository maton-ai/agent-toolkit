import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createCustomerParameters = z.object({
  name: z.string().describe('The name of the customer'),
  email: z.string().describe('The email address of the customer'),
  phone: z.string().describe('The phone number of the customer'),
  description: z.string().describe('The description of the customer'),
  address1: z.string().describe('The first line of the address'),
  address2: z.string().describe('The second line of the address'),
  city: z.string().describe('The city of the address'),
  state: z.string().describe('The state of the address'),
  postal_code: z.string().describe('The postal code of the address'),
  country: z.string().describe('The country of the address'),
});

export const createInvoiceItemParameters = z.object({
  customer_id: z.string().describe('The ID of the customer'),
  invoice_id: z.string().describe('The ID of the invoice'),
  subscription_id: z.string().describe('The ID of the subscription'),
  price_id: z.string().describe('The ID of the price'),
  quantity: z.number().describe('The quantity of the invoice item'),
  amount: z.number().describe('The amount of the invoice item'),
  description: z.string().describe('The description of the invoice item'),
  currency: z.string().describe('The currency of the invoice item'),
});

export const createInvoiceParameters = z.object({
  customer_id: z.string().describe('The ID of the customer'),
  subscription_id: z.string().describe('The ID of the subscription'),
  description: z.string().describe('The description of the invoice'),
  collection_method: z
    .enum(['charge_automatically', 'send_invoice'])
    .describe('The collection method of the invoice'),
  days_until_due: z
    .number()
    .describe('The number of days until the invoice is due'),
});

export const deleteCustomerParameters = z.object({
  customer_id: z.string().describe('The ID of the customer'),
});

export const getCustomerParameters = z.object({
  customer_id: z.string().describe('The ID of the customer'),
});

export const getInvoiceParameters = z.object({
  invoice_id: z.string().describe('The ID of the invoice'),
});

export const listCustomersParameters = z.object({
  email: z.string().describe('The email address of the customer').optional(),
  limit: z.number().describe('The number of results to return').optional(),
});

export const listInvoicesParameters = z.object({
  email: z.string().describe('The email address of the customer').optional(),
  limit: z.number().describe('The number of results to return').optional(),
});
