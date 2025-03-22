
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import SearchBar from '@/components/documents/SearchBar';
import DocumentList from '@/components/documents/DocumentList';
import DeleteDocumentDialog from '@/components/documents/DeleteDocumentDialog';
import { useDocuments } from '@/hooks/useDocuments';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    documents,
    loading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    documentToDelete,
    setDocumentToDelete,
    isDeleting,
    deleteDocument
  } = useDocuments(user?.id);
  
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the document
    setDocumentToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Documents" 
      />
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex-1 px-3">
        <DocumentList 
          documents={documents}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          loading={loading}
          handleDeleteClick={handleDeleteClick}
        />
      </div>
      
      <DeleteDocumentDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDelete={deleteDocument}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Index;
