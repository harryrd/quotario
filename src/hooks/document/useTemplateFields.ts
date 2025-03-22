
import { useState, useCallback } from 'react';
import { DocumentType } from '@/types/document';
import { TableField } from '@/components/table/types';
import { FieldTemplate } from '@/components/settings/template/types';
import { supabase } from '@/integrations/supabase/client';

// Define default fields for each document type
const defaultQuotationFields: TableField[] = [
  { id: 'desc', name: 'Description', type: 'text', required: true },
  { id: 'qty', name: 'Quantity', type: 'number', required: true },
  { id: 'price', name: 'Unit Price', type: 'number', required: true }
];

const defaultInvoiceFields: TableField[] = [
  { id: 'desc', name: 'Description', type: 'text', required: true },
  { id: 'qty', name: 'Quantity', type: 'number', required: true },
  { id: 'price', name: 'Unit Price', type: 'number', required: true },
  { id: 'tax', name: 'Tax (%)', type: 'number' }
];

export const useTemplateFields = (userId: string | undefined) => {
  const [fields, setFields] = useState<TableField[]>(defaultQuotationFields);

  const fetchTemplateFields = useCallback(async (type: DocumentType) => {
    if (!userId) {
      // If not logged in, use defaults
      setFields(type === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .single();
      
      if (error) {
        console.error(`Error fetching ${type} template:`, error);
        setFields(type === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
        return;
      }
      
      if (data && data.fields) {
        // Convert template fields to table fields
        const templateFields = data.fields as unknown as FieldTemplate[];
        const activeFields = templateFields
          .filter(field => field.enabled)
          .sort((a, b) => a.position - b.position)
          .map(field => ({
            id: field.id,
            name: field.name,
            type: field.type,
            required: field.required,
            options: field.options
          }));
        
        if (activeFields.length > 0) {
          setFields(activeFields);
        } else {
          // Fallback to defaults if no fields are enabled
          setFields(type === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
        }
      } else {
        // Use defaults if no template is found
        setFields(type === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
      }
    } catch (error) {
      console.error('Error in fetchTemplateFields:', error);
      setFields(type === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
    }
  }, [userId]);

  return {
    fields,
    setFields,
    fetchTemplateFields
  };
};
