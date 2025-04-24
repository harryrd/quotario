
import { z } from 'zod';

export const documentItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  tax: z.number().optional(),
});

export type DocumentItem = z.infer<typeof documentItemSchema>;

export const documentSchema = z.object({
  id: z.string(),
  type: z.enum(['quotation', 'invoice']),
  title: z.string(),
  client_name: z.string(),
  date: z.string(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
  status: z.string(),
  items: z.array(documentItemSchema),
  document_number: z.string().optional(),
  client_address: z.string().optional(),
  client_email: z.string().optional(),
  client_phone: z.string().optional(),
  client_company: z.string().optional(),
});

export type Document = z.infer<typeof documentSchema>;

export const businessDetailsSchema = z.object({
  company_name: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
});

export type BusinessDetails = z.infer<typeof businessDetailsSchema>;

export const quotationSchema = z.object({
  id: z.string(),
  document_number: z.string(),
  title: z.string(),
  date: z.string(),
  status: z.string(),
  client_name: z.string(),
  client_email: z.string().optional(),
  client_phone: z.string().optional(),
  client_address: z.string().optional(),
  client_company: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(documentItemSchema),
});

export type QuotationData = z.infer<typeof quotationSchema>;

// Add QuotationItem type as an alias to DocumentItem for backward compatibility
export type QuotationItem = DocumentItem;
