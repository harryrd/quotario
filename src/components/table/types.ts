
export interface TableField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'image'; // Added 'image' to support the custom field type
  options?: string[];
  required?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}
