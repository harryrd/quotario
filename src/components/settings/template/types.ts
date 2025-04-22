
export interface FieldTemplate {
  id: string;
  name: string;
  required: boolean;
  position: number;
  enabled: boolean;
  type: 'text' | 'number' | 'date' | 'select' | 'image'; // Added 'image' type to support custom field type
  options?: string[]; // For select fields
}

export interface DocumentTemplate {
  id: string;
  user_id: string;
  type: 'quotation' | 'invoice';
  fields: FieldTemplate[];
  pdf_template?: string; // Added pdf_template property
  created_at?: string;
  updated_at?: string;
}
