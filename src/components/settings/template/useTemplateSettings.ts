import { useState } from 'react';
import { toast } from 'sonner';
import { useCustomFields } from '@/hooks/document/template/useCustomFields';
import { useTemplateFields } from '@/hooks/document/template/useTemplateFields'; 
import { TemplateTab, Field } from '@/schemas/template';

export const useTemplateSettings = (userId: string | undefined) => {
  const [activeTab, setActiveTab] = useState<TemplateTab>('quotation');
  const {
    loading,
    saving,
    quotationFields,
    setQuotationFields,
    invoiceFields,
    setInvoiceFields,
    handleSave
  } = useTemplateFields(userId);
  const {
    quotationPdfTemplate,
    invoicePdfTemplate,
    handlePdfTemplateChange
  } = useCustomFields(userId);

  const countCustomFields = (fields: Field[]) => {
    return fields.filter(field => field.custom).length;
  };

  const addCustomField = () => {
    if (activeTab === 'quotation') {
      setQuotationFields(prevFields => {
        if (countCustomFields(prevFields) >= 3) {
          toast.error('You can only add up to 3 custom fields.');
          return prevFields;
        }
        const newField: Field = {
          id: `custom-${Date.now()}`,
          name: 'Custom Field',
          type: 'text',
          enabled: true,
          custom: true,
          position: prevFields.length,
        };
        return [...prevFields, newField];
      });
    } else {
      setInvoiceFields(prevFields => {
        if (countCustomFields(prevFields) >= 3) {
          toast.error('You can only add up to 3 custom fields.');
          return prevFields;
        }
        const newField: Field = {
          id: `custom-${Date.now()}`,
          name: 'Custom Field',
          type: 'text',
          enabled: true,
          custom: true,
          position: prevFields.length,
        };
        return [...prevFields, newField];
      });
    }
  };

  const removeCustomField = (id: string) => {
    if (activeTab === 'quotation') {
      setQuotationFields(prevFields => {
        return prevFields.filter(field => field.id !== id);
      });
    } else {
      setInvoiceFields(prevFields => {
        return prevFields.filter(field => field.id !== id);
      });
    }
  };

  return {
    loading,
    saving,
    quotationFields,
    setQuotationFields,
    invoiceFields,
    setInvoiceFields,
    quotationPdfTemplate,
    invoicePdfTemplate,
    activeTab,
    setActiveTab,
    countCustomFields,
    addCustomField,
    removeCustomField,
    handlePdfTemplateChange,
    handleSave
  };
};
