
import { useEffect, useState } from 'react';
import { useFetchDocument } from './useFetchDocument';
import { useDocumentEdit } from './useDocumentEdit';
import { useDocumentActions } from './useDocumentActions';
import { Document, DocumentItem } from '@/types/document-details';

export type { Document, BusinessDetails } from '@/types/document-details';

export const useDocumentDetails = (documentId: string | undefined, userId: string | undefined) => {
  const { document: fetchedDocument, businessDetails, loading } = useFetchDocument(documentId, userId);
  const [document, setDocument] = useState<Document | null>(null);
  
  // Update local document when fetched document changes
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
  
  // Handle document conversion to invoice
  const convertToInvoice = async () => {
    const updatedDocument = await handleConvertToInvoice();
    if (updatedDocument) {
      setDocument(updatedDocument);
      if (editableDocument) {
        setEditableDocument({ ...editableDocument, type: 'invoice' as const });
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
