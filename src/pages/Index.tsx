import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Search, Filter, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DocumentCard, { DocumentCardProps } from '@/components/DocumentCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the document
    setDocumentToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteDocument = async () => {
    if (!documentToDelete || !user) {
      setIsDeleteDialogOpen(false);
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // First delete document items
      const { error: itemsError } = await supabase
        .from('document_items')
        .delete()
        .eq('document_id', documentToDelete);
      
      if (itemsError) {
        throw itemsError;
      }
      
      // Then delete the document
      const { error: docError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentToDelete)
        .eq('user_id', user.id);
      
      if (docError) {
        throw docError;
      }
      
      // Update the UI
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
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
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Document
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDocument}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
