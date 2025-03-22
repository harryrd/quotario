
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
}

export interface BusinessDetails {
  company_name: string;
  address: string;
  email: string;
  phone: string;
}
