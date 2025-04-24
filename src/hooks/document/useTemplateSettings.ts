
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTemplateFields } from './template/useTemplateFields';
import { useCustomFields } from './template/useCustomFields';
import { usePdfTemplate } from './template/usePdfTemplate';
import { type FieldTemplate } from '@/schemas/template';

export const useTemplateSettings = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'quotation' | 'invoice'>('quotation');

  // Initialize separate hooks for each template type
  const {
    fields: quotationFields,
    removeField: removeQuotationField,
    updateFields: updateQuotationFields,
  } = useTemplateFields();

  const {
    fields: invoiceFields,
    removeField: removeInvoiceField,
    updateFields: updateInvoiceFields,
  } = useTemplateFields();

  const { countCustomFields, addCustomField } = useCustomFields();
  
  const {
    pdfTemplate: quotationPdfTemplate,
    updatePdfTemplate: updateQuotationPdfTemplate,
  } = usePdfTemplate();

  const {
    pdfTemplate: invoicePdfTemplate,
    updatePdfTemplate: updateInvoicePdfTemplate,
  } = usePdfTemplate();

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching templates:', error);
          toast.error('Failed to load templates');
          return;
        }

        if (data && data.length > 0) {
          const quotationTemplate = data.find(t => t.type === 'quotation');
          const invoiceTemplate = data.find(t => t.type === 'invoice');

          if (quotationTemplate) {
            updateQuotationFields(quotationTemplate.fields as unknown as FieldTemplate[]);
            updateQuotationPdfTemplate(quotationTemplate.pdf_template || 'template1');
          } else {
            updateQuotationFields(getDefaultQuotationFields());
          }

          if (invoiceTemplate) {
            updateInvoiceFields(invoiceTemplate.fields as unknown as FieldTemplate[]);
            updateInvoicePdfTemplate(invoiceTemplate.pdf_template || 'template1');
          } else {
            updateInvoiceFields(getDefaultInvoiceFields());
          }
        } else {
          updateQuotationFields(getDefaultQuotationFields());
          updateInvoiceFields(getDefaultInvoiceFields());
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) {
      toast.error('You must be logged in to save settings');
      return;
    }

    try {
      setSaving(true);

      const { error: quotationError } = await supabase
        .from('document_templates')
        .upsert({
          user_id: userId,
          type: 'quotation',
          fields: quotationFields as unknown as any,
          pdf_template: quotationPdfTemplate
        }, { onConflict: 'user_id,type' });

      if (quotationError) {
        throw quotationError;
      }

      const { error: invoiceError } = await supabase
        .from('document_templates')
        .upsert({
          user_id: userId,
          type: 'invoice',
          fields: invoiceFields as unknown as any,
          pdf_template: invoicePdfTemplate
        }, { onConflict: 'user_id,type' });

      if (invoiceError) {
        throw invoiceError;
      }

      toast.success('Template settings saved successfully');
    } catch (error) {
      console.error('Error saving templates:', error);
      toast.error('Failed to save template settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomField = (name: string, type: 'text' | 'image') => {
    const currentFields = activeTab === 'quotation' ? quotationFields : invoiceFields;
    const updatedFields = addCustomField(currentFields, name, type);
    
    if (updatedFields !== currentFields) {
      if (activeTab === 'quotation') {
        updateQuotationFields(updatedFields);
      } else {
        updateInvoiceFields(updatedFields);
      }
      toast.success('Custom field added');
    }
  };

  const handlePdfTemplateChange = (templateId: string) => {
    if (activeTab === 'quotation') {
      updateQuotationPdfTemplate(templateId);
    } else {
      updateInvoicePdfTemplate(templateId);
    }
  };

  const getDefaultQuotationFields = (): FieldTemplate[] => [
    { id: 'description', name: 'Description', required: true, position: 0, enabled: true, type: 'text' },
    { id: 'quantity', name: 'Quantity', required: true, position: 1, enabled: true, type: 'number' },
    { id: 'unit_price', name: 'Unit Price', required: true, position: 2, enabled: true, type: 'number' },
    { id: 'discount', name: 'Discount', required: false, position: 3, enabled: true, type: 'number' },
    { id: 'total', name: 'Total', required: false, position: 4, enabled: true, type: 'number' }
  ];

  const getDefaultInvoiceFields = (): FieldTemplate[] => [
    { id: 'description', name: 'Description', required: true, position: 0, enabled: true, type: 'text' },
    { id: 'quantity', name: 'Quantity', required: true, position: 1, enabled: true, type: 'number' },
    { id: 'unit_price', name: 'Unit Price', required: true, position: 2, enabled: true, type: 'number' },
    { id: 'tax', name: 'Tax (%)', required: false, position: 3, enabled: true, type: 'number' },
    { id: 'discount', name: 'Discount', required: false, position: 4, enabled: false, type: 'number' },
    { id: 'total', name: 'Total', required: false, position: 5, enabled: true, type: 'number' }
  ];

  return {
    loading,
    saving,
    quotationFields,
    invoiceFields,
    quotationPdfTemplate,
    invoicePdfTemplate,
    activeTab,
    setActiveTab,
    countCustomFields,
    handleAddCustomField,
    handlePdfTemplateChange,
    handleSave,
    removeQuotationField,
    removeInvoiceField
  };
};
