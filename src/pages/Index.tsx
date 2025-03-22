
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { FilePlus, FileText } from 'lucide-react';
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
      <Header title="Documents" />
      
      <div className="flex-1 container max-w-5xl py-4 space-y-4">
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
      </div>
      
      {/* Floating action buttons */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Button 
          className="shadow-lg" 
          onClick={() => navigate('/create/invoice')}
          size="default"
        >
          <FileText className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
        <Button 
          className="shadow-lg" 
          onClick={() => navigate('/create/quotation')}
          variant="default"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          New Quotation
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
