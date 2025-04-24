
import { z } from 'zod';

export const tableFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['text', 'number', 'date', 'select', 'image']),
  options: z.array(z.string()).optional(),
  required: z.boolean().optional(),
});

export type TableField = z.infer<typeof tableFieldSchema>;

export const tableRowSchema = z.object({
  id: z.string(),
}).and(z.record(z.string(), z.any()));

export type TableRow = z.infer<typeof tableRowSchema>;
