
export interface FieldTemplate {
  id: string;
  name: string;
  required: boolean;
  position: number;
  enabled: boolean;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[]; // For select fields
}
