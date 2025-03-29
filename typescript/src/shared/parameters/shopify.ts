import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const createOrderParameters = z.object({
  line_items: z
    .array(
      z.object({
        title: z.string().describe('The title of the product'),
        price: z.number().describe('The price of the product'),
        quantity: z
          .number()
          .optional()
          .describe('The quantity of the product to add to the order'),
      })
    )
    .describe('List of dictionaries containing the following keys'),
});

export const getOrderParameters = z.object({
  order_id: z.string().describe('The ID of the order'),
});

export const listOrdersParameters = z.object({
  fulfillment_status: z
    .enum(['shipped', 'partial', 'unshipped'])
    .optional()
    .describe('The fulfillment status of the orders'),
});
