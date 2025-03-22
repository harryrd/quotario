
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DocumentTypeSelector from '@/components/documents/DocumentTypeSelector';
import DocumentDetailsForm from '@/components/documents/DocumentDetailsForm';
import DocumentItemsSection from '@/components/documents/DocumentItemsSection';
import DocumentActions from '@/components/documents/DocumentActions';
import { DocumentType, DocumentDetails } from '@/types/document';
import { TableField, TableRow } from '@/components/CustomizableTable';
import { Client } from '@/types/client';

const CreateDocument: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialType = location.state?.type || 'quotation';
  
  const [activeTab, setActiveTab] = useState('details');
  const [documentType, setDocumentType] = useState<DocumentType>(initialType);
  const [details, setDetails] = useState<DocumentDetails>({
    title: '',
    client: null,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  });
  
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
  
  const [fields, setFields] = useState<TableField[]>(
    documentType === 'quotation' ? defaultQuotationFields : defaultInvoiceFields
  );
  
  const [rows, setRows] = useState<TableRow[]>([
    { id: '1', desc: '', qty: '', price: '', tax: '' }
  ]);
  
  // Update fields when document type changes
  useEffect(() => {
    setFields(documentType === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
  }, [documentType]);
  
  const handleClientSelect = (client: Client) => {
    setDetails(prev => ({ ...prev, client }));
  };

  const handleTypeChange = (type: DocumentType) => {
    setDocumentType(type);
  };
  
  const handleDetailsChange = (updatedDetails: DocumentDetails) => {
    setDetails(updatedDetails);
  };
  
  const handleSave = (status: 'draft' | 'sent') => {
    // Validate required fields
    if (!details.title || !details.client || !details.date) {
      toast.error('Please fill in all required fields');
      setActiveTab('details');
      return;
    }
    
    // Check if table has at least one row with required fields filled
    const hasValidRow = rows.some(row => {
      return fields.every(field => {
        return !field.required || (row[field.id] && row[field.id] !== '');
      });
    });
    
    if (!hasValidRow) {
      toast.error('Please add at least one complete item to your document');
      setActiveTab('items');
      return;
    }
    
    // In a real app, you would save to a database here
    toast.success(`Your ${documentType} has been ${status === 'draft' ? 'saved' : 'sent'}`);
    navigate('/');
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
            <DocumentDetailsForm
              documentType={documentType}
              details={details}
              onDetailsChange={handleDetailsChange}
              onContinue={() => setActiveTab('items')}
            />
          </TabsContent>
          
          <TabsContent value="items" className="mt-0">
            <DocumentItemsSection
              documentType={documentType}
              fields={fields}
              rows={rows}
              onFieldsChange={setFields}
              onRowsChange={setRows}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <DocumentActions onSave={handleSave} />
    </div>
  );
};

export default CreateDocument;
