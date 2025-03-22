export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}

export interface Document {
  id: string;
  type: 'quotation' | 'invoice';
  title: string;
  client_name: string;
  date: string;
  due_date?: string;
  notes?: string;
  status: string;
  items: DocumentItem[];
  document_number?: string;
}

export interface BusinessDetails {
  company_name: string;
  address: string;
  email: string;
  phone: string;
}

export interface QuotationData {
  id: string;
  document_number: string;
  title: string;
  date: string;
  status: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  client_company?: string;
  notes?: string;
  items: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}
