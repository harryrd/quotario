
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentCardProps } from '@/components/DocumentCard';
import { toast } from 'sonner';

// Demo data for fallback
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

export const useDocuments = (userId: string | undefined) => {
  const [documents, setDocuments] = useState<DocumentCardProps[]>(demoDocuments);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = async () => {
    // Only try to fetch from the database if the user is authenticated
    if (userId) {
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
          .eq('user_id', userId);
          
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

  const deleteDocument = async () => {
    if (!documentToDelete || !userId) {
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
        .eq('user_id', userId);
      
      if (docError) {
        throw docError;
      }
      
      // Update the UI immediately by removing the deleted document from state
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentToDelete));
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

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  return {
    documents,
    loading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    documentToDelete,
    setDocumentToDelete,
    isDeleting,
    deleteDocument
  };
};
