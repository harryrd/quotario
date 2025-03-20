
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DocumentCard, { DocumentCardProps } from '@/components/DocumentCard';
import AnimatedTransition from '@/components/AnimatedTransition';

// Sample data
const initialDocuments: DocumentCardProps[] = [
  {
    id: '1',
    type: 'quotation',
    title: 'Website Development',
    clientName: 'Acme Corp',
    date: '2023-10-15',
    amount: 2500.00,
    status: 'sent'
  },
  {
    id: '2',
    type: 'invoice',
    title: 'Logo Design',
    clientName: 'TechStart Inc',
    date: '2023-11-01',
    amount: 750.00,
    status: 'paid'
  },
  {
    id: '3',
    type: 'quotation',
    title: 'Mobile App Development',
    clientName: 'Bright Ideas LLC',
    date: '2023-11-10',
    amount: 4800.00,
    status: 'draft'
  },
  {
    id: '4',
    type: 'invoice',
    title: 'SEO Services',
    clientName: 'Golden Gate Media',
    date: '2023-10-28',
    amount: 1200.00,
    status: 'accepted'
  }
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentCardProps[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  const handleCreateDocument = (type: 'quotation' | 'invoice') => {
    navigate('/create', { state: { type } });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Documents" 
        actions={
          <Button 
            variant="default" 
            size="sm" 
            className="h-8 px-2 py-1 text-xs"
            onClick={() => navigate('/create')}
          >
            <FilePlus className="h-3 w-3 mr-1" />
            New
          </Button>
        }
      />
      
      <div className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-7 h-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Filter className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex-1 px-3">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-3">
            <TabsTrigger value="all" className="text-xs py-1">All</TabsTrigger>
            <TabsTrigger value="quotation" className="text-xs py-1">Quotations</TabsTrigger>
            <TabsTrigger value="invoice" className="text-xs py-1">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <AnimatedTransition>
              <div className="grid gap-3 pb-16">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.id} 
                      {...doc} 
                      onClick={() => handleOpenDocument(doc.id)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-3 text-sm">No documents found</p>
                    {activeTab === 'all' ? (
                      <Button 
                        onClick={() => navigate('/create')}
                        className="text-xs py-1 h-8"
                      >
                        Create Your First Document
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleCreateDocument(activeTab as 'quotation' | 'invoice')}
                        className="text-xs py-1 h-8"
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
      </div>
      
      <motion.div 
        className="fixed bottom-4 left-0 right-0 flex justify-center gap-3 px-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button 
          className="flex-1 glass-card shadow-sm text-xs py-1 h-8"
          onClick={() => handleCreateDocument('quotation')}
        >
          New Quotation
        </Button>
        <Button 
          className="flex-1 glass-card shadow-sm text-xs py-1 h-8"
          onClick={() => handleCreateDocument('invoice')}
        >
          New Invoice
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
