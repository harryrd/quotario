
import { useState, useEffect } from 'react';
import { TableRow } from '@/components/table/types';
import { useAuth } from '@/components/AuthContext';
import { useDocumentDetails } from './document/useDocumentDetails';
import { useTemplateFields } from './document/useTemplateFields';
import { useUserSettings } from './document/useUserSettings';
import { useDocumentSave } from './document/useDocumentSave';

export { UserSettings } from './document/useUserSettings';

export const useDocumentCreation = () => {
  const { user } = useAuth();
  
  // Compose hooks
  const {
    activeTab,
    setActiveTab,
    documentType,
    details,
    handleTypeChange,
    handleDetailsChange,
    handleClientSelect
  } = useDocumentDetails();
  
  const userSettings = useUserSettings(user?.id);
  
  const {
    fields,
    setFields,
    fetchTemplateFields
  } = useTemplateFields(user?.id);
  
  const {
    isLoading,
    documentId,
    handleSave: saveDocument
  } = useDocumentSave(user?.id);
  
  const [rows, setRows] = useState<TableRow[]>([
    { id: '1', desc: '', qty: '', price: '', tax: '' }
  ]);
  
  // Initialize rows when fields change
  useEffect(() => {
    if (fields.length > 0) {
      const newRow: TableRow = { id: '1' };
      fields.forEach(field => {
        newRow[field.id] = '';
      });
      setRows([newRow]);
    }
  }, [fields]);
  
  // Adapter function to maintain the same API
  const handleSave = async (status: 'draft' | 'sent') => {
    return await saveDocument(documentType, details, rows, status);
  };

  return {
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
  };
};
