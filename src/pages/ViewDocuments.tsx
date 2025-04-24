import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/components/AuthContext';
import DocumentDetails from '@/components/documents/DocumentDetails';
import DocumentActions from '@/components/documents/DocumentActions';
import DocumentEditActions from '@/components/documents/DocumentEditActions';
import { useDocumentDetails } from '@/hooks/document/useDocumentDetails';
import { Document, BusinessDetails, DocumentItem } from '@/schemas/document-details';
import DeleteDocumentDialog from '@/components/documents/DeleteDocumentDialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Re-export the types for other components to use
export type { Document, BusinessDetails, DocumentItem };

const ViewDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const {
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
    handleConvertToInvoice,
    handlePreviewPDF,
    formatDate
  } = useDocumentDetails(id, user?.id);
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteDocument = async () => {
    if (!id || !user?.id) return;
    
    setIsDeleting(true);
    try {
      // First delete document items
      const { error: itemsError } = await supabase
        .from('document_items')
        .delete()
        .eq('document_id', id);
      
      if (itemsError) {
        throw itemsError;
      }
      
      // Then delete the document
      const { error: docError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (docError) {
        throw docError;
      }
      
      toast.success('Document deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Custom back handler to return to the documents page
  const handleBack = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Loading..." showBack onBack={handleBack} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <p>Loading document...</p>
        </div>
      </div>
    );
  }
  
  if (!document || !editableDocument) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Document Not Found" showBack onBack={handleBack} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 p-4">
          <p>The document you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={`${document.type === 'quotation' ? 'Quotation' : 'Invoice'} Details`}
        showBack
        onBack={handleBack}
        actions={
          <>
            <DocumentEditActions 
              isEditing={isEditing}
              savingChanges={savingChanges}
              onStartEditing={handleStartEditing}
              onCancelEditing={handleCancelEditing}
              onSaveChanges={handleSaveChanges}
            />
          </>
        }
      />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <DocumentDetails 
            document={document}
            editableDocument={editableDocument}
            businessDetails={businessDetails}
            isEditing={isEditing}
            savingChanges={savingChanges}
            setEditableDocument={setEditableDocument}
            formatDate={formatDate}
          />
        </AnimatedTransition>
      </div>
      
      <DocumentActions 
        documentId={document.id}
        documentType={document.type}
        onPreviewPDF={handlePreviewPDF}
        onConvertToInvoice={handleConvertToInvoice}
        onDeleteDocument={handleDeleteClick}
      />
      
      <DeleteDocumentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteDocument}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ViewDocuments;
