import type {CoreTool} from 'ai';
import {tool} from 'ai';
import {z} from 'zod';
import MatonAPI from '../shared/api';

export default function MatonTool(
  matonAPI: MatonAPI,
  method: string,
  description: string,
  schema: z.ZodObject<any, any, any, any, {[x: string]: any}>
): CoreTool {
  return tool({
    description: description,
    parameters: schema,
    execute: (arg: z.output<typeof schema>) => {
      return matonAPI.run(method, arg);
    },
  });
}
