
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import SearchBar from '@/components/documents/SearchBar';
import DocumentList from '@/components/documents/DocumentList';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/components/AuthContext';
import { DocumentType } from '@/schemas/document';
import { Document } from '@/schemas/document-details';
import DeleteDocumentDialog from '@/components/documents/DeleteDocumentDialog';

const ViewDocuments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DocumentType>('quotation');
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user } = useAuth();
  const { documents, loading, deleteDocument } = useDocuments(user?.id);

  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    document.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab: DocumentType) => {
    setActiveTab(tab);
    setSearchQuery(''); // Clear search query when switching tabs
  };

  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      await deleteDocument();
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Documents" showSettings />

      <div className="flex-1 container max-w-5xl py-6 space-y-8">
        <Tabs defaultValue="quotation" className="space-y-4" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="quotation">Quotations</TabsTrigger>
            <TabsTrigger value="invoice">Invoices</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="quotation" className="space-y-4">
            <AnimatedTransition>
              <div className="space-y-4">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <DocumentList
                  documents={filteredDocuments}
                  loading={loading}
                  onDelete={handleDelete}
                />
              </div>
            </AnimatedTransition>
          </TabsContent>
          <TabsContent value="invoice" className="space-y-4">
            <AnimatedTransition>
              <div className="space-y-4">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <DocumentList
                  documents={filteredDocuments}
                  loading={loading}
                  onDelete={handleDelete}
                />
              </div>
            </AnimatedTransition>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteDocumentDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={confirmDelete}
        isDeleting={false}
      />
    </div>
  );
};

export default ViewDocuments;
