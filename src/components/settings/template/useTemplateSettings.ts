
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FieldTemplate } from './types';

export const useTemplateSettings = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quotationFields, setQuotationFields] = useState<FieldTemplate[]>([]);
  const [invoiceFields, setInvoiceFields] = useState<FieldTemplate[]>([]);
  const [quotationPdfTemplate, setQuotationPdfTemplate] = useState<string>('template1');
  const [invoicePdfTemplate, setInvoicePdfTemplate] = useState<string>('template1');
  const [activeTab, setActiveTab] = useState<'quotation' | 'invoice'>('quotation');

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
            setQuotationFields(quotationTemplate.fields as unknown as FieldTemplate[]);
            setQuotationPdfTemplate(quotationTemplate.pdf_template || 'template1');
          } else {
            setQuotationFields(getDefaultQuotationFields());
          }

          if (invoiceTemplate) {
            setInvoiceFields(invoiceTemplate.fields as unknown as FieldTemplate[]);
            setInvoicePdfTemplate(invoiceTemplate.pdf_template || 'template1');
          } else {
            setInvoiceFields(getDefaultInvoiceFields());
          }
        } else {
          setQuotationFields(getDefaultQuotationFields());
          setInvoiceFields(getDefaultInvoiceFields());
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

  const countCustomFields = (fields: FieldTemplate[]) =>
    fields.filter(f => f.id.startsWith('custom_')).length;

  const addCustomField = (name: string, type: 'text' | 'image') => {
    if (name.trim() === '') {
      toast.error('Custom field name cannot be empty');
      return;
    }

    const currentFields = activeTab === 'quotation' ? quotationFields : invoiceFields;

    if (countCustomFields(currentFields) >= 3) {
      toast.error('You can add up to 3 custom fields only');
      return;
    }

    const duplicate = currentFields.some(
      (f) => f.name.toLowerCase() === name.toLowerCase()
    );
    
    if (duplicate) {
      toast.error('Custom field name already exists');
      return;
    }

    const newField: FieldTemplate = {
      id: `custom_${Date.now()}`,
      name: name,
      required: false,
      position: currentFields.length,
      enabled: true,
      type: type,
    };

    if (activeTab === 'quotation') {
      setQuotationFields([...quotationFields, newField]);
    } else {
      setInvoiceFields([...invoiceFields, newField]);
    }

    toast.success('Custom field added');
  };

  const removeCustomField = (fieldId: string) => {
    if (activeTab === 'quotation') {
      setQuotationFields(prevFields => prevFields.filter(f => f.id !== fieldId));
    } else {
      setInvoiceFields(prevFields => prevFields.filter(f => f.id !== fieldId));
    }
  };

  const handlePdfTemplateChange = (templateId: string) => {
    if (activeTab === 'quotation') {
      setQuotationPdfTemplate(templateId);
    } else {
      setInvoicePdfTemplate(templateId);
    }
  };

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
