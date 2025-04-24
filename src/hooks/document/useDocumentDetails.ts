import { useEffect, useState } from 'react';
import { useFetchDocument } from './useFetchDocument';
import { useDocumentEdit } from './useDocumentEdit';
import { useDocumentActions } from './useDocumentActions';
import { type Document, type BusinessDetails } from '@/schemas/document-details';

export type { Document, BusinessDetails } from '@/schemas/document-details';

export const useDocumentDetails = (documentId: string | undefined, userId: string | undefined) => {
  const { document: fetchedDocument, businessDetails, loading } = useFetchDocument(documentId, userId);
  const [document, setDocument] = useState<Document | null>(null);
  
  useEffect(() => {
    if (fetchedDocument) {
      setDocument(fetchedDocument);
    }
  }, [fetchedDocument]);
  
  const {
    editableDocument,
    setEditableDocument,
    isEditing,
    savingChanges,
    handleStartEditing,
    handleCancelEditing,
    handleSaveChanges
  } = useDocumentEdit(document, userId);
  
  const {
    handleConvertToInvoice,
    handlePreviewPDF,
    formatDate
  } = useDocumentActions(document, userId);
  
  const convertToInvoice = async () => {
    const updatedDocument = await handleConvertToInvoice();
    if (updatedDocument) {
      setDocument({
        ...updatedDocument,
        type: 'invoice' as const
      });
      
      if (editableDocument) {
        setEditableDocument({
          ...editableDocument,
          type: 'invoice' as const
        });
      }
    }
  };

  return {
    document,
    editableDocument,
    setEditableDocument,
    businessDetails,
    loading,
    isEditing,
    savingChanges,
    handleStartEditing,
    handleCancelEditing,
    handleSaveChanges,
    handleConvertToInvoice: convertToInvoice,
    handlePreviewPDF,
    formatDate
  };
};
