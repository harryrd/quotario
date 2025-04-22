
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthContext';
import { useTemplateSettings } from './useTemplateSettings';
import TabContent from './TabContent';
import CustomFieldSection from './CustomFieldSection';
import PdfTemplateSelector from './PdfTemplateSelector';

const TemplateSettings: React.FC = () => {
  const { user } = useAuth();
  const {
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
  } = useTemplateSettings(user?.id);

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading template settings...</div>;
  }

  const currentFields = activeTab === 'quotation' ? quotationFields : invoiceFields;
  const customFieldsCount = countCustomFields(currentFields);
  const canAddCustomField = customFieldsCount < 3;
  const currentPdfTemplate = activeTab === 'quotation' ? quotationPdfTemplate : invoicePdfTemplate;

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
          <TabContent
            fields={quotationFields}
            setFields={setQuotationFields}
            templateType="quotation"
            onRemoveField={removeCustomField}
          />
        </TabsContent>

        <TabsContent value="invoice" className="space-y-5">
          <TabContent
            fields={invoiceFields}
            setFields={setInvoiceFields}
            templateType="invoice"
            onRemoveField={removeCustomField}
          />
        </TabsContent>
      </Tabs>

      <CustomFieldSection
        canAddCustomField={canAddCustomField}
        onAddField={addCustomField}
      />

      <div className="border rounded-md p-4 bg-muted/30">
        <PdfTemplateSelector 
          selectedTemplate={currentPdfTemplate}
          onChange={handlePdfTemplateChange}
          templateType={activeTab}
        />
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
