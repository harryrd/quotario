
import { useState } from 'react';
import { toast } from 'sonner';
import { type FieldTemplate } from '@/schemas/template';

export const useCustomFields = () => {
  const countCustomFields = (fields: FieldTemplate[]) =>
    fields.filter(f => f.id.startsWith('custom_')).length;

  const addCustomField = (fields: FieldTemplate[], name: string, type: 'text' | 'image') => {
    if (name.trim() === '') {
      toast.error('Custom field name cannot be empty');
      return fields;
    }

    if (countCustomFields(fields) >= 3) {
      toast.error('You can add up to 3 custom fields only');
      return fields;
    }

    const duplicate = fields.some(
      (f) => f.name.toLowerCase() === name.toLowerCase()
    );
    
    if (duplicate) {
      toast.error('Custom field name already exists');
      return fields;
    }

    const newField: FieldTemplate = {
      id: `custom_${Date.now()}`,
      name: name,
      required: false,
      position: fields.length,
      enabled: true,
      type: type,
    };

    return [...fields, newField];
  };

  return {
    countCustomFields,
    addCustomField,
  };
};
