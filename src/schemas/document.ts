
import { z } from 'zod';
import { clientSchema } from './client';
import { tableFieldSchema, tableRowSchema } from './table';

export const documentTypeSchema = z.enum(['quotation', 'invoice']);
export type DocumentType = z.infer<typeof documentTypeSchema>;

export const documentDetailsSchema = z.object({
  title: z.string(),
  client: clientSchema.nullable(),
  date: z.string(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  documentNumber: z.string().optional(),
});

export type DocumentDetails = z.infer<typeof documentDetailsSchema>;

export const documentStateSchema = z.object({
  details: documentDetailsSchema,
  fields: z.array(tableFieldSchema),
  rows: z.array(tableRowSchema),
});

export type DocumentState = z.infer<typeof documentStateSchema>;
