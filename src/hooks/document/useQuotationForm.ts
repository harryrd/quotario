import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { TableField, TableRow } from '@/components/table/types';
import { Client } from '@/schemas/client';
import { DocumentDetails } from '@/schemas/document';
import { useUserSettings } from '@/hooks/document/useUserSettings';
import { useDocumentSave } from '@/hooks/document/useDocumentSave';
import { FieldTemplate } from '@/schemas/template';

export const useQuotationForm = (userId: string | undefined) => {
  const navigate = useNavigate();
  const userSettings = useUserSettings(userId);

  // Document save hook
  const { handleSave, isLoading, documentId, navigateToDetails } = useDocumentSave(userId);

  // State for document details
  const [details, setDetails] = useState<DocumentDetails>({
    title: '',
    client: null,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    documentNumber: ''
  });

  // State for table fields and rows
  const [fields, setFields] = useState<TableField[]>([
    { id: 'desc', name: 'Description', type: 'text', required: true },
    { id: 'qty', name: 'Quantity', type: 'number', required: true },
    { id: 'price', name: 'Price', type: 'number', required: true },
    { id: 'tax', name: 'Tax %', type: 'number', required: false },
  ]);

  const [rows, setRows] = useState<TableRow[]>([
    { id: '1', desc: '', qty: '', price: '', tax: '' }
  ]);

  // Effect to navigate to document details page after successful save
  useEffect(() => {
    if (documentId && navigateToDetails) {
      navigate(`/document/${documentId}`);
    }
  }, [documentId, navigateToDetails, navigate]);

  // Effect to load template fields from settings
  useEffect(() => {
    if (userSettings && userSettings.documentTemplates?.quotation) {
      try {
        const templateFields = userSettings.documentTemplates.quotation.fields;
        if (Array.isArray(templateFields)) {
          // Convert template fields to table fields
          const enabledFields = templateFields
            .filter((field: FieldTemplate) => field.enabled)
            .sort((a: FieldTemplate, b: FieldTemplate) => a.position - b.position)
            .map((field: FieldTemplate) => ({
              id: field.id,
              name: field.name,
              type: field.type,
              required: field.required,
              options: field.options
            }));
          
          if (enabledFields.length > 0) {
            setFields(enabledFields);
            
            // Update rows to include all fields
            const fieldIds = enabledFields.map(f => f.id);
            setRows(prevRows => prevRows.map(row => {
              const updatedRow: TableRow = { id: row.id };
              fieldIds.forEach(id => {
                updatedRow[id] = row[id] || '';
              });
              return updatedRow;
            }));
          }
        }
      } catch (error) {
        console.error('Error setting template fields:', error);
      }
    }
  }, [userSettings]);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setDetails(prev => ({ ...prev, client }));
  };

  // Handle form submission
  const handleSubmitQuotation = async () => {
    // Validate required fields
    if (!details.title) {
      toast.error('Please provide a document title');
      return;
    }

    const prefix = userSettings?.quotationPrefix || 'QUO-';
    const startNumber = userSettings?.quotationStartNumber || '1001';
    
    // Save the document as sent (not draft)
    await handleSave(
      'quotation',
      details,
      rows,
      'sent',
      prefix,
      startNumber
    );
  };

  const updateTitle = (title: string) => {
    setDetails(prev => ({ ...prev, title }));
  };

  const updateDate = (date: string) => {
    setDetails(prev => ({ ...prev, date }));
  };

  const updateNotes = (notes: string) => {
    setDetails(prev => ({ ...prev, notes }));
  };

  const updateDocumentNumber = (documentNumber: string) => {
    setDetails(prev => ({ ...prev, documentNumber }));
  };

  return {
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
  };
};
