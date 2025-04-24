
import { z } from 'zod';

export const fieldTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  required: z.boolean(),
  position: z.number(),
  enabled: z.boolean(),
  type: z.enum(['text', 'number', 'date', 'select', 'image']),
  options: z.array(z.string()).optional(),
});

export type FieldTemplate = z.infer<typeof fieldTemplateSchema>;

export const documentTemplateSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: z.enum(['quotation', 'invoice']),
  fields: z.array(fieldTemplateSchema),
  pdf_template: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type DocumentTemplate = z.infer<typeof documentTemplateSchema>;

// Add missing TemplateTab type
export type TemplateTab = 'quotation' | 'invoice';

// Add Field type (simpler version of FieldTemplate for use in custom fields)
export type Field = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'image';
  enabled: boolean;
  position: number;
  required?: boolean;
  custom?: boolean;
  options?: string[];
};
