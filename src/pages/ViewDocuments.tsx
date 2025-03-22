
import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/components/AuthContext';
import DocumentDetails from '@/components/documents/DocumentDetails';
import DocumentActions from '@/components/documents/DocumentActions';
import DocumentEditActions from '@/components/documents/DocumentEditActions';
import { useDocumentDetails, Document, DocumentItem, BusinessDetails } from '@/hooks/useDocumentDetails';

// Re-export the types for other components to use
export type { Document, DocumentItem, BusinessDetails };

const ViewDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
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
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Loading..." showBack />
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
        <Header title="Document Not Found" showBack />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 p-4">
          <p>The document you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={`${document.type === 'quotation' ? 'Quotation' : 'Invoice'} Details`}
        showBack
        actions={
          <DocumentEditActions 
            isEditing={isEditing}
            savingChanges={savingChanges}
            onStartEditing={handleStartEditing}
            onCancelEditing={handleCancelEditing}
            onSaveChanges={handleSaveChanges}
          />
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
      />
    </div>
  );
};

export default ViewDocuments;
