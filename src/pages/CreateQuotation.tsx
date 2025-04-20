
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import QuotationDetailsForm from '@/components/quotation/QuotationDetailsForm';
import QuotationItemsTable from '@/components/quotation/QuotationItemsTable';
import QuotationActions from '@/components/quotation/QuotationActions';
import { useQuotationForm } from '@/hooks/document/useQuotationForm';
import ItemsFormDialog from '@/components/ItemsFormDialog';

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

  // State for controlling ItemsFormDialog open/close
  const [isItemsDialogOpen, setItemsDialogOpen] = useState(false);

  // Callback to save items from dialog
  const handleSaveItems = (newRows: typeof rows) => {
    setRows(newRows);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Create New Quotation" 
        showBack={true}
        showSettings={false}
      />
      
      <div className="flex-1 container max-w-5xl py-6 px-4 md:px-6 space-y-8">
        <QuotationDetailsForm
          details={details}
          userSettings={userSettings}
          onTitleChange={updateTitle}
          onClientSelect={handleClientSelect}
          onDateChange={updateDate}
          onNotesChange={updateNotes}
          onDocumentNumberChange={updateDocumentNumber}
        />
        
        {/* Add Items Button */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
            onClick={() => setItemsDialogOpen(true)}
          >
            Add Items
          </button>
        </div>

        {/* Items table: make it non-editable here, editing only in dialog */}
        <QuotationItemsTable
          fields={fields}
          rows={rows}
          onFieldsChange={setFields}
          onRowsChange={setRows}
          currency={userSettings?.currency || 'USD'}
          // Do not allow inline editing here to avoid conflict
        />

        {/* ItemsFormDialog */}
        <ItemsFormDialog
          open={isItemsDialogOpen}
          onOpenChange={setItemsDialogOpen}
          fields={fields}
          initialRows={rows}
          onSave={handleSaveItems}
          title="Quotation Items"
        />

        <div className="fixed bottom-4 left-0 right-0 px-4 md:px-6">
          <QuotationActions
            onSave={handleSubmitQuotation}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuotation;

