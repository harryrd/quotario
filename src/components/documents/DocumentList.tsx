
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentCard, { DocumentCardProps } from '@/components/DocumentCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  documents: DocumentCardProps[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  searchQuery: string;
  loading: boolean;
  handleDeleteClick: (id: string, e: React.MouseEvent) => void;
  onCreateDocument: (type: 'quotation' | 'invoice') => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  activeTab,
  setActiveTab,
  searchQuery,
  loading,
  handleDeleteClick,
  onCreateDocument,
}) => {
  const navigate = useNavigate();

  const filteredDocuments = documents.filter(doc => {
    // Filter by tab
    if (activeTab !== 'all' && doc.type !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.clientName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleOpenDocument = (id: string) => {
    navigate(`/document/${id}`);
  };

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-3">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="quotation">Quotations</TabsTrigger>
        <TabsTrigger value="invoice">Invoices</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-0">
        <AnimatedTransition>
          <div className="grid gap-3 pb-16">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="relative">
                  <DocumentCard 
                    {...doc} 
                    onClick={() => handleOpenDocument(doc.id)}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={(e) => handleDeleteClick(doc.id, e)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-3">No documents found</p>
                {activeTab === 'all' ? (
                  <Button 
                    onClick={() => navigate('/create')}
                  >
                    Create Your First Document
                  </Button>
                ) : (
                  <Button 
                    onClick={() => onCreateDocument(activeTab as 'quotation' | 'invoice')}
                  >
                    Create Your First {activeTab === 'quotation' ? 'Quotation' : 'Invoice'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </AnimatedTransition>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentList;
