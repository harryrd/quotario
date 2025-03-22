
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share, Printer, Edit, FileText, Menu, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}

interface Document {
  id: string;
  type: 'quotation' | 'invoice';
  title: string;
  client_name: string;
  date: string;
  due_date?: string;
  notes?: string;
  status: string;
  items: DocumentItem[];
}

const ViewDocuments: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch document
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();
          
        if (documentError) {
          toast.error('Error fetching document');
          console.error('Error fetching document:', documentError);
          return;
        }
        
        if (!documentData) {
          toast.error('Document not found');
          navigate('/');
          return;
        }
        
        // Fetch document items
        const { data: itemsData, error: itemsError } = await supabase
          .from('document_items')
          .select('*')
          .eq('document_id', id);
          
        if (itemsError) {
          toast.error('Error fetching document items');
          console.error('Error fetching document items:', itemsError);
          return;
        }
        
        setDocument({
          ...documentData,
          items: itemsData || []
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id, user, navigate]);
  
  const handlePreviewPDF = () => {
    toast.success('Preparing PDF preview...');
    // In a real app, this would generate and display a PDF
  };
  
  const handleConvertToInvoice = async () => {
    if (!document || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .update({ type: 'invoice' })
        .eq('id', document.id)
        .select()
        .single();
        
      if (error) {
        toast.error('Failed to convert to invoice');
        console.error('Error converting to invoice:', error);
        return;
      }
      
      setDocument({ ...document, type: 'invoice' });
      toast.success('Converted quotation to invoice');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Loading..." showBack />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading document...</p>
        </div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Document Not Found" showBack />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 p-4">
          <p>The document you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/')}>Go to Documents</Button>
        </div>
      </div>
    );
  }
  
  // Calculate subtotal and total
  const calculateSubtotal = () => {
    return document.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unit_price));
    }, 0);
  };
  
  const calculateTax = () => {
    return document.items.reduce((sum, item) => {
      const lineTotal = Number(item.quantity) * Number(item.unit_price);
      return sum + (lineTotal * (Number(item.tax || 0) / 100));
    }, 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax;
  };
  
  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const total = calculateTotal();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={`${document.type === 'quotation' ? 'Quotation' : 'Invoice'} Details`}
        showBack
        actions={
          <Button variant="outline" onClick={() => navigate(`/edit/${document.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        }
      />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="p-8 bg-white rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-semibold mb-2">{document.title}</h1>
                <p className="text-muted-foreground mb-6">
                  {document.type === 'quotation' ? 'Quotation for' : 'Invoice for'} {document.client_name}
                </p>
              </div>
              <Badge 
                className={`
                  uppercase px-2 py-1 
                  ${document.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : ''}
                  ${document.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
                  ${document.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                  ${document.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                  ${document.status === 'declined' ? 'bg-red-100 text-red-800' : ''}
                `}
              >
                {document.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-medium mb-1">From:</h3>
                <p>Your Company Name</p>
                <p>123 Business Street</p>
                <p>City, State 12345</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">To:</h3>
                <p>{document.client_name}</p>
                <p>Client Address</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
              <div>
                <h3 className="font-medium mb-1">Document Number:</h3>
                <p>{document.type === 'quotation' ? 'QUO-' : 'INV-'}{document.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Date:</h3>
                <p>{formatDate(document.date)}</p>
              </div>
              {document.due_date && (
                <div>
                  <h3 className="font-medium mb-1">{document.type === 'quotation' ? 'Valid Until' : 'Due Date'}:</h3>
                  <p>{formatDate(document.due_date)}</p>
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-right">Quantity</th>
                    <th className="py-2 px-4 text-right">Unit Price</th>
                    {document.type === 'invoice' && (
                      <th className="py-2 px-4 text-right">Tax (%)</th>
                    )}
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {document.items.map((item) => {
                    const itemTotal = Number(item.quantity) * Number(item.unit_price);
                    return (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-4">{item.description}</td>
                        <td className="py-2 px-4 text-right">{item.quantity}</td>
                        <td className="py-2 px-4 text-right">${Number(item.unit_price).toFixed(2)}</td>
                        {document.type === 'invoice' && (
                          <td className="py-2 px-4 text-right">{item.tax || 0}%</td>
                        )}
                        <td className="py-2 px-4 text-right">${itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {tax > 0 && (
                  <div className="flex justify-between py-2">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-t border-t-gray-200">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {document.notes && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Notes:</h3>
                <p className="text-muted-foreground">{document.notes}</p>
              </div>
            )}
          </div>
        </AnimatedTransition>
      </div>
      
      <motion.div 
        className="fixed bottom-6 left-0 right-0 flex justify-center px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="w-full flex justify-center">
          <div className="flex flex-row gap-3 w-full max-w-md">
            <Button 
              className="flex-1"
              onClick={handlePreviewPDF}
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview PDF
            </Button>
            
            <Button 
              className="flex-1"
              onClick={() => toast.success('Document shared successfully')}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="h-13 w-13 p-2 aspect-square"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.success('Downloading document...')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => toast.success('Printing document...')}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
                
                {document.type === 'quotation' && (
                  <DropdownMenuItem onClick={handleConvertToInvoice}>
                    <FilePlus className="h-4 w-4 mr-2" />
                    Convert to Invoice
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewDocuments;
