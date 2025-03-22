
import { Client } from './client';
import { TableField, TableRow } from '@/components/CustomizableTable';

export type DocumentType = 'quotation' | 'invoice';

export interface DocumentDetails {
  title: string;
  client: Client | null;
  date: string;
  dueDate?: string;
  notes?: string;
}

export interface DocumentState {
  details: DocumentDetails;
  fields: TableField[];
  rows: TableRow[];
}
