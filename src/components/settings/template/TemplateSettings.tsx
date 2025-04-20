import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FieldTemplate } from './types';
import TemplateManager from './TemplateManager';

const TemplateSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quotationFields, setQuotationFields] = useState<FieldTemplate[]>([]);
  const [invoiceFields, setInvoiceFields] = useState<FieldTemplate[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .eq('user_id', user.id);

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
          } else {
            setQuotationFields(getDefaultQuotationFields());
          }

          if (invoiceTemplate) {
            setInvoiceFields(invoiceTemplate.fields as unknown as FieldTemplate[]);
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
  }, [user]);

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

  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldType, setCustomFieldType] = useState<'text' | 'image'>('text');
  const [activeTab, setActiveTab] = useState<'quotation' | 'invoice'>('quotation');

  const countCustomFields = (fields: FieldTemplate[]) =>
    fields.filter(f => f.id.startsWith('custom_')).length;

  const addCustomField = () => {
    if (customFieldName.trim() === '') {
      toast.error('Custom field name cannot be empty');
      return;
    }

    const currentFields = activeTab === 'quotation' ? quotationFields : invoiceFields;

    if (countCustomFields(currentFields) >= 3) {
      toast.error('You can add up to 3 custom fields only');
      return;
    }

    const duplicate = currentFields.some(
      f => f.name.toLowerCase() === customFieldName.trim().toLowerCase()
    );
    if (duplicate) {
      toast.error('Custom field name already exists');
      return;
    }

    const newField: FieldTemplate = {
      id: `custom_${Date.now()}`,
      name: customFieldName.trim(),
      required: false,
      position: currentFields.length,
      enabled: true,
      type: customFieldType,
    };

    if (activeTab === 'quotation') {
      setQuotationFields([...quotationFields, newField]);
    } else {
      setInvoiceFields([...invoiceFields, newField]);
    }

    setCustomFieldName('');
    setCustomFieldType('text');

    toast.success('Custom field added');
  };

  const removeCustomField = (fieldId: string) => {
    if (activeTab === 'quotation') {
      setQuotationFields(prevFields => prevFields.filter(f => f.id !== fieldId));
    } else {
      setInvoiceFields(prevFields => prevFields.filter(f => f.id !== fieldId));
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    try {
      setSaving(true);

      const { error: quotationError } = await supabase
        .from('document_templates')
        .upsert({
          user_id: user.id,
          type: 'quotation',
          fields: quotationFields as unknown as any
        }, { onConflict: 'user_id,type' });

      if (quotationError) {
        throw quotationError;
      }

      const { error: invoiceError } = await supabase
        .from('document_templates')
        .upsert({
          user_id: user.id,
          type: 'invoice',
          fields: invoiceFields as unknown as any
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

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading template settings...</div>;
  }

  const currentFields = activeTab === 'quotation' ? quotationFields : invoiceFields;
  const customFieldsCount = countCustomFields(currentFields);
  const canAddCustomField = customFieldsCount < 3;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Template Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure which fields appear in your quotations and invoices
        </p>
      </div>

      <Tabs 
        value={activeTab}
        onValueChange={value => setActiveTab(value as 'quotation' | 'invoice')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="quotation">Quotation Template</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Template</TabsTrigger>
        </TabsList>

        <TabsContent value="quotation" className="space-y-5">
          <TemplateManager
            fields={quotationFields}
            setFields={setQuotationFields}
            templateType="quotation"
            onRemoveField={removeCustomField}
          />
        </TabsContent>

        <TabsContent value="invoice" className="space-y-5">
          <TemplateManager
            fields={invoiceFields}
            setFields={setInvoiceFields}
            templateType="invoice"
            onRemoveField={removeCustomField}
          />
        </TabsContent>
      </Tabs>

      <div className="border rounded-md p-4 bg-muted/30">
        <h3 className="text-base font-semibold mb-2">Add Custom Field</h3>
        {!canAddCustomField && (
          <p className="text-sm text-destructive mb-2">
            You have reached the maximum of 3 custom fields per template.
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            className="flex-grow rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Field name"
            value={customFieldName}
            onChange={(e) => setCustomFieldName(e.target.value)}
            disabled={!canAddCustomField}
          />
          <select
            className="rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={customFieldType}
            onChange={(e) => setCustomFieldType(e.target.value as 'text' | 'image')}
            disabled={!canAddCustomField}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
          <Button
            onClick={addCustomField}
            disabled={!canAddCustomField}
          >
            Add
          </Button>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        className="mt-4" 
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default TemplateSettings;
