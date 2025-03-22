
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DocumentTypeSelector from '@/components/documents/DocumentTypeSelector';
import DocumentDetailsForm from '@/components/documents/DocumentDetailsForm';
import DocumentItemsSection from '@/components/documents/DocumentItemsSection';
import DocumentActions from '@/components/documents/DocumentActions';
import { useDocumentCreation } from '@/hooks/useDocumentCreation';

const CreateDocument: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    documentType,
    details,
    isLoading,
    userSettings,
    fields,
    rows,
    handleTypeChange,
    handleDetailsChange,
    handleSave,
    setFields,
    setRows,
    handleClientSelect
  } = useDocumentCreation();
  
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <Header 
        title={`New ${documentType === 'quotation' ? 'Quotation' : 'Invoice'}`} 
        showBack
      />
      
      <DocumentTypeSelector 
        documentType={documentType}
        onTypeChange={handleTypeChange}
      />
      
      <div className="flex-1 px-3">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-3">
            <TabsTrigger value="details" className="text-xs py-1">Details</TabsTrigger>
            <TabsTrigger value="items" className="text-xs py-1">Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-0">
            <DocumentDetailsForm
              documentType={documentType}
              details={details}
              onDetailsChange={handleDetailsChange}
              onContinue={() => setActiveTab('items')}
              prefix={documentType === 'quotation' ? userSettings.quotationPrefix : userSettings.invoicePrefix}
              startNumber={documentType === 'quotation' ? userSettings.quotationStartNumber : userSettings.invoiceStartNumber}
              currency={userSettings.currency}
            />
          </TabsContent>
          
          <TabsContent value="items" className="mt-0">
            <DocumentItemsSection
              documentType={documentType}
              fields={fields}
              rows={rows}
              onFieldsChange={setFields}
              onRowsChange={setRows}
              currency={userSettings.currency}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <DocumentActions onSave={handleSave} isLoading={isLoading} />
    </div>
  );
};

export default CreateDocument;
