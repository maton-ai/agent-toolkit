import {z} from 'zod';

export const checkConnectionParameters = z.object({});

export const startConnectionParameters = z.object({});

export const transferAgentParameters = z.object({
  user_prompt: z.string().describe('The user prompt'),
});

export const addColumnParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  column: z.string().describe('The column letter'),
});

export const addMultipleRowsParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  values: z.array(z.array(z.string())).describe('The values of the rows'),
});

export const clearCellParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  cell: z.string().describe('The A1 notation of the cell. E.g., `A1`'),
});

export const clearRowsParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  start_row: z.number().describe('The starting row number'),
  end_row: z.number().describe('The ending row number (inclusive)'),
});

export const createSpreadsheetParameters = z.object({
  title: z.string().describe('The title of Google spreadsheet'),
});

export const createWorksheetParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  title: z.string().describe('The title of Google spreadsheet'),
});

export const deleteRowsParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  start_row: z.number().describe('The starting row number'),
  end_row: z.number().describe('The ending row number (inclusive)'),
});

export const deleteWorksheetParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
});

export const findRowParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  column: z.string().describe('The column letter'),
  value: z.string().describe('The value to search for'),
});

export const getCellParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  cell: z.string().describe('The A1 notation of the cell. E.g., `A1`'),
});

export const getSpreadsheetParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
});

export const getValuesInRangeParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  range: z
    .string()
    .describe('The A1 notation of the values to retrieve. E.g., `A1:E5`'),
});

export const listWorksheetsParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
});

export const updateCellParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  cell: z.string().describe('The A1 notation of the cell. E.g., `A1`'),
  value: z.string().describe('The value to update'),
});

export const updateMultipleRowsParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  range: z
    .string()
    .describe('The A1 notation of the values to retrieve. E.g., `A1:E5`'),
  values: z.array(z.array(z.string())).describe('The values to update'),
});

export const updateRowParameters = z.object({
  spreadsheet_id: z.string().describe('The ID of Google spreadsheet'),
  worksheet_id: z.string().describe('The ID of worksheet'),
  row: z.number().describe('The row number'),
  values: z.array(z.string()).describe('The values to update'),
});
