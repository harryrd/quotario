
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
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching templates:', error);
          toast.error('Failed to load templates');
          return;
        }
        
        if (data && data.length > 0) {
          const quotationTemplate = data.find(t => t.type === 'quotation');
          const invoiceTemplate = data.find(t => t.type === 'invoice');
          
          if (quotationTemplate) {
            setQuotationFields(quotationTemplate.fields);
          } else {
            setQuotationFields(getDefaultQuotationFields());
          }
          
          if (invoiceTemplate) {
            setInvoiceFields(invoiceTemplate.fields);
          } else {
            setInvoiceFields(getDefaultInvoiceFields());
          }
        } else {
          // Set default templates if none exist
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

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    try {
      setSaving(true);
      
      // Upsert quotation template
      const { error: quotationError } = await supabase
        .from('document_templates')
        .upsert({
          user_id: user.id,
          type: 'quotation',
          fields: quotationFields
        }, { onConflict: 'user_id,type' });
      
      if (quotationError) {
        throw quotationError;
      }
      
      // Upsert invoice template
      const { error: invoiceError } = await supabase
        .from('document_templates')
        .upsert({
          user_id: user.id,
          type: 'invoice',
          fields: invoiceFields
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Template Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure which fields appear in your quotations and invoices
        </p>
      </div>

      <Tabs defaultValue="quotation" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="quotation">Quotation Template</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotation" className="space-y-5">
          <TemplateManager 
            fields={quotationFields} 
            setFields={setQuotationFields}
            templateType="quotation"
          />
        </TabsContent>
        
        <TabsContent value="invoice" className="space-y-5">
          <TemplateManager 
            fields={invoiceFields} 
            setFields={setInvoiceFields}
            templateType="invoice"
          />
        </TabsContent>
      </Tabs>

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
