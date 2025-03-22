
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DocumentTypeSelector from '@/components/documents/DocumentTypeSelector';
import DocumentActions from '@/components/documents/DocumentActions';
import DocumentDetailsTab from '@/components/documents/DocumentDetailsTab';
import DocumentItemsTab from '@/components/documents/DocumentItemsTab';
import { useDocumentCreation } from '@/hooks/useDocumentCreation';
import { useNavigate } from 'react-router-dom';

const CreateDocument: React.FC = () => {
  const navigate = useNavigate();
  
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
    handleClientSelect,
    fetchTemplateFields,
    documentId
  } = useDocumentCreation();
  
  // Fetch template fields when document type changes
  useEffect(() => {
    fetchTemplateFields(documentType);
  }, [documentType, fetchTemplateFields]);
  
  // Handle document save with redirection
  const handleDocumentSave = async (status: 'draft' | 'sent') => {
    const savedId = await handleSave(status);
    
    if (savedId) {
      if (status === 'draft') {
        // Go back to documents list
        navigate('/');
      } else {
        // Go to document details
        navigate(`/document/${savedId}`);
      }
    }
  };
  
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
            <DocumentDetailsTab
              documentType={documentType}
              details={details}
              onDetailsChange={handleDetailsChange}
              onContinue={() => setActiveTab('items')}
              userSettings={userSettings}
            />
          </TabsContent>
          
          <TabsContent value="items" className="mt-0">
            <DocumentItemsTab
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
      
      <DocumentActions onSave={handleDocumentSave} isLoading={isLoading} />
    </div>
  );
};

export default CreateDocument;
