
export interface TableField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  required?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}
