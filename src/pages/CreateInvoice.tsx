
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import InvoiceDetailsForm from '@/components/invoice/InvoiceDetailsForm';
import InvoiceItemsTable from '@/components/invoice/InvoiceItemsTable';
import InvoiceActions from '@/components/invoice/InvoiceActions';
import { useInvoiceForm } from '@/hooks/document/useInvoiceForm';

const CreateInvoice: React.FC = () => {
  const { user } = useAuth();
  const {
    details,
    fields,
    rows,
    isLoading,
    userSettings,
    updateTitle,
    updateDate,
    updateDueDate,
    updateNotes,
    updateDocumentNumber,
    handleClientSelect,
    handleSubmitInvoice,
    setFields,
    setRows
  } = useInvoiceForm(user?.id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Create New Invoice" 
        showBack={true}
        showSettings={false}
      />
      
      <div className="flex-1 container max-w-5xl py-6 space-y-8">
        {/* Document details section */}
        <InvoiceDetailsForm
          details={details}
          onTitleChange={updateTitle}
          onClientSelect={handleClientSelect}
          onDateChange={updateDate}
          onDueDateChange={updateDueDate}
          onNotesChange={updateNotes}
          onDocumentNumberChange={updateDocumentNumber}
        />
        
        {/* Items table */}
        <InvoiceItemsTable
          fields={fields}
          rows={rows}
          onFieldsChange={setFields}
          onRowsChange={setRows}
          currency={userSettings?.currency || 'USD'}
        />
        
        {/* Action buttons */}
        <InvoiceActions
          onSave={handleSubmitInvoice}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateInvoice;
