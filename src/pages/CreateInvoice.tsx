
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import InvoiceDetailsForm from '@/components/invoice/InvoiceDetailsForm';
import InvoiceItemsTable from '@/components/invoice/InvoiceItemsTable';
import InvoiceActions from '@/components/invoice/InvoiceActions';
import { useInvoiceForm } from '@/hooks/document/useInvoiceForm';
import ItemsFormDialog from '@/components/ItemsFormDialog';

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

  const [isItemsDialogOpen, setItemsDialogOpen] = useState(false);

  const handleSaveItems = (newRows: typeof rows) => {
    setRows(newRows);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Create New Invoice" 
        showBack={true}
        showSettings={false}
      />
      
      <div className="flex-1 container max-w-5xl py-6 px-4 md:px-6 space-y-8">
        <InvoiceDetailsForm
          details={details}
          userSettings={userSettings}
          onTitleChange={updateTitle}
          onClientSelect={handleClientSelect}
          onDateChange={updateDate}
          onDueDateChange={updateDueDate}
          onNotesChange={updateNotes}
          onDocumentNumberChange={updateDocumentNumber}
        />
        
        <div className="flex justify-end mb-2">
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
            onClick={() => setItemsDialogOpen(true)}
          >
            Add Items
          </button>
        </div>

        <InvoiceItemsTable
          fields={fields}
          rows={rows}
          onFieldsChange={setFields}
          onRowsChange={setRows}
          currency={userSettings?.currency || 'USD'}
        />

        <ItemsFormDialog
          open={isItemsDialogOpen}
          onOpenChange={setItemsDialogOpen}
          fields={fields}
          initialRows={rows}
          onSave={handleSaveItems}
          title="Invoice Items"
        />

        <div className="fixed bottom-4 left-0 right-0 px-4 md:px-6">
          <InvoiceActions
            onSave={handleSubmitInvoice}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
