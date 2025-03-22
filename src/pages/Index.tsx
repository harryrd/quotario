
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DocumentCard, { DocumentCardProps } from '@/components/DocumentCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Sample data for demo purposes
const demoDocuments: DocumentCardProps[] = [
  // Quotations
  {
    id: '1',
    type: 'quotation',
    title: 'Website Redesign',
    clientName: 'Acme Corporation',
    date: '2024-03-01',
    amount: 3750.00,
    status: 'draft'
  },
  {
    id: '2',
    type: 'quotation',
    title: 'Mobile App Development',
    clientName: 'TechStart Inc',
    date: '2024-03-05',
    amount: 8250.00,
    status: 'sent'
  },
  {
    id: '3',
    type: 'quotation',
    title: 'SEO Optimization',
    clientName: 'Global Media Group',
    date: '2024-03-10',
    amount: 2400.00,
    status: 'accepted'
  },
  {
    id: '4',
    type: 'quotation',
    title: 'Logo Design',
    clientName: 'Bright Future LLC',
    date: '2024-03-15',
    amount: 950.00,
    status: 'declined'
  },
  {
    id: '5',
    type: 'quotation',
    title: 'Marketing Campaign',
    clientName: 'Sunshine Foods',
    date: '2024-03-20',
    amount: 5500.00,
    status: 'draft'
  },
  // Invoices
  {
    id: '6',
    type: 'invoice',
    title: 'Server Maintenance',
    clientName: 'CloudTech Solutions',
    date: '2024-03-02',
    amount: 1850.00,
    status: 'sent'
  },
  {
    id: '7',
    type: 'invoice',
    title: 'Content Writing',
    clientName: 'NewsDaily',
    date: '2024-03-07',
    amount: 3250.00,
    status: 'paid'
  },
  {
    id: '8',
    type: 'invoice',
    title: 'UI/UX Consulting',
    clientName: 'Innovation Labs',
    date: '2024-03-12',
    amount: 4800.00,
    status: 'draft'
  },
  {
    id: '9',
    type: 'invoice',
    title: 'Video Production',
    clientName: 'VisualArts Studio',
    date: '2024-03-17',
    amount: 7500.00,
    status: 'sent'
  },
  {
    id: '10',
    type: 'invoice',
    title: 'Data Analysis',
    clientName: 'Research Insights',
    date: '2024-03-22',
    amount: 3950.00,
    status: 'paid'
  }
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentCardProps[]>(demoDocuments);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      // Only try to fetch from the database if the user is authenticated
      if (user) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('documents')
            .select(`
              id,
              type,
              title,
              client_name,
              date,
              status,
              document_items(unit_price, quantity)
            `)
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error fetching documents:', error);
            // Fall back to demo data
            setDocuments(demoDocuments);
            return;
          }
          
          if (data && data.length > 0) {
            // Transform the data to match DocumentCardProps
            const transformedData = data.map(doc => {
              // Calculate total amount from document items
              const totalAmount = doc.document_items?.reduce((sum, item) => {
                return sum + (Number(item.quantity) * Number(item.unit_price));
              }, 0) || 0;
              
              return {
                id: doc.id,
                type: doc.type as 'quotation' | 'invoice',
                title: doc.title,
                clientName: doc.client_name,
                date: doc.date,
                amount: totalAmount,
                status: doc.status as 'draft' | 'sent' | 'accepted' | 'declined' | 'paid'
              };
            });
            
            setDocuments(transformedData);
          } else {
            // If no documents found, use demo data
            setDocuments(demoDocuments);
          }
        } catch (error) {
          console.error('Unexpected error:', error);
          setDocuments(demoDocuments);
        } finally {
          setLoading(false);
        }
      } else {
        // Not authenticated, use demo data
        setDocuments(demoDocuments);
      }
    };
    
    fetchDocuments();
  }, [user]);
  
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
    if (!user) {
      toast.error("Please sign in to create documents");
      navigate('/sign-in');
      return;
    }
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
            onClick={() => navigate('/create')}
          >
            <FilePlus className="h-4 w-4 mr-1" />
            New
          </Button>
        }
      />
      
      <div className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 px-3">
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
                    <DocumentCard 
                      key={doc.id} 
                      {...doc} 
                      onClick={() => handleOpenDocument(doc.id)}
                    />
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
                        onClick={() => handleCreateDocument(activeTab as 'quotation' | 'invoice')}
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
          className="flex-1 glass-card shadow-sm"
          onClick={() => handleCreateDocument('quotation')}
        >
          New Quotation
        </Button>
        <Button 
          className="flex-1 glass-card shadow-sm"
          onClick={() => handleCreateDocument('invoice')}
        >
          New Invoice
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
