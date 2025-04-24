
import { useState } from 'react';
import { toast } from 'sonner';
import { type FieldTemplate } from '@/schemas/template';

export const useTemplateFields = (initialFields: FieldTemplate[] = []) => {
  const [fields, setFields] = useState<FieldTemplate[]>(initialFields);

  const removeField = (fieldId: string) => {
    setFields(prevFields => prevFields.filter(f => f.id !== fieldId));
  };

  const updateFields = (newFields: FieldTemplate[]) => {
    setFields(newFields);
  };

  return {
    fields,
    removeField,
    updateFields,
  };
};
