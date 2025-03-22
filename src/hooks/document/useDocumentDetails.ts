
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DocumentType, DocumentDetails } from '@/types/document';
import { Client } from '@/types/client';

export const useDocumentDetails = () => {
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

  const handleTypeChange = (type: DocumentType) => {
    setDocumentType(type);
  };
  
  const handleDetailsChange = (updatedDetails: DocumentDetails) => {
    setDetails(updatedDetails);
  };
  
  const handleClientSelect = (client: Client) => {
    setDetails(prev => ({ ...prev, client }));
  };

  return {
    activeTab,
    setActiveTab,
    documentType,
    details,
    handleTypeChange,
    handleDetailsChange,
    handleClientSelect
  };
};
