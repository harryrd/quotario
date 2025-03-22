
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { FilePlus, FileText, Plus } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import AnimatedTransition from '@/components/AnimatedTransition';
import SearchBar from '@/components/documents/SearchBar';
import DocumentList from '@/components/documents/DocumentList';
import DeleteDocumentDialog from '@/components/documents/DeleteDocumentDialog';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
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
    e.stopPropagation(); // Prevent document opening when clicking delete
    setDocumentToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Documents" 
      />
      
      <AnimatedTransition>
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <DocumentList 
          documents={documents}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          loading={loading}
          handleDeleteClick={handleDeleteClick}
        />
      </AnimatedTransition>
      
      {/* Floating action buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 sm:flex-row">
        <Button 
          className="rounded-full shadow-lg" 
          size="sm"
          onClick={() => navigate('/create/quotation')}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          New Quotation
        </Button>
        <Button 
          className="rounded-full shadow-lg" 
          size="sm"
          variant="secondary" 
          onClick={() => navigate('/create/invoice')}
        >
          <FileText className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
      
      <DeleteDocumentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={deleteDocument}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Index;
