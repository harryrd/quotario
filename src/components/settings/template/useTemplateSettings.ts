
import { useState } from 'react';
import { toast } from 'sonner';
import { useCustomFields } from '@/hooks/document/template/useCustomFields';
import { useTemplateFields } from '@/hooks/document/template/useTemplateFields'; 
import { usePdfTemplate } from '@/hooks/document/template/usePdfTemplate';
import { TemplateTab, type Field, type FieldTemplate } from '@/schemas/template';

export const useTemplateSettings = (userId: string | undefined) => {
  const [activeTab, setActiveTab] = useState<TemplateTab>('quotation');
  
  // Create instances of the hooks
  const quotationTemplate = useTemplateFields();
  const invoiceTemplate = useTemplateFields();
  const customFields = useCustomFields();
  const quotationPdf = usePdfTemplate();
  const invoicePdf = usePdfTemplate();
  
  // Track loading and saving state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Map the properties for easier access
  const quotationFields = quotationTemplate.fields;
  const setQuotationFields = quotationTemplate.updateFields;
  const invoiceFields = invoiceTemplate.fields;
  const setInvoiceFields = invoiceTemplate.updateFields;

  const countCustomFields = (fields: FieldTemplate[]) => {
    return customFields.countCustomFields(fields);
  };

  const addCustomField = (name: string, type: 'text' | 'image') => {
    if (activeTab === 'quotation') {
      const updatedFields = customFields.addCustomField(quotationFields, name, type);
      if (updatedFields !== quotationFields) {
        setQuotationFields(updatedFields);
        toast.success('Custom field added');
      }
    } else {
      const updatedFields = customFields.addCustomField(invoiceFields, name, type);
      if (updatedFields !== invoiceFields) {
        setInvoiceFields(updatedFields);
        toast.success('Custom field added');
      }
    }
  };

  const removeCustomField = (id: string) => {
    if (activeTab === 'quotation') {
      quotationTemplate.removeField(id);
    } else {
      invoiceTemplate.removeField(id);
    }
  };

  const handlePdfTemplateChange = (templateId: string) => {
    if (activeTab === 'quotation') {
      quotationPdf.updatePdfTemplate(templateId);
    } else {
      invoicePdf.updatePdfTemplate(templateId);
    }
  };

  // Save function - can be implemented more fully later if needed
  const handleSave = () => {
    setSaving(true);
    // Simulating save operation
    setTimeout(() => {
      toast.success('Template settings saved');
      setSaving(false);
    }, 1000);
  };

  return {
    loading,
    saving,
    quotationFields,
    setQuotationFields,
    invoiceFields,
    setInvoiceFields,
    quotationPdfTemplate: quotationPdf.pdfTemplate,
    invoicePdfTemplate: invoicePdf.pdfTemplate,
    activeTab,
    setActiveTab,
    countCustomFields,
    addCustomField,
    removeCustomField,
    handlePdfTemplateChange,
    handleSave
  };
};
