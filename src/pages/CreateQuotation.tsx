
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import QuotationDetailsForm from '@/components/quotation/QuotationDetailsForm';
import QuotationItemsTable from '@/components/quotation/QuotationItemsTable';
import QuotationActions from '@/components/quotation/QuotationActions';
import { useQuotationForm } from '@/hooks/document/useQuotationForm';

const CreateQuotation: React.FC = () => {
  const { user } = useAuth();
  const {
    details,
    fields,
    rows,
    isLoading,
    userSettings,
    updateTitle,
    updateDate,
    updateNotes,
    updateDocumentNumber,
    handleClientSelect,
    handleSubmitQuotation,
    setFields,
    setRows
  } = useQuotationForm(user?.id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Create New Quotation" 
        showBack={true}
        showSettings={false}
      />
      
      <div className="flex-1 container max-w-5xl py-6 space-y-8">
        {/* Document details section */}
        <QuotationDetailsForm
          details={details}
          onTitleChange={updateTitle}
          onClientSelect={handleClientSelect}
          onDateChange={updateDate}
          onNotesChange={updateNotes}
          onDocumentNumberChange={updateDocumentNumber}
        />
        
        {/* Items table */}
        <QuotationItemsTable
          fields={fields}
          rows={rows}
          onFieldsChange={setFields}
          onRowsChange={setRows}
          currency={userSettings?.currency || 'USD'}
        />
        
        {/* Action buttons */}
        <QuotationActions
          onSave={handleSubmitQuotation}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateQuotation;
