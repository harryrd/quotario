
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentCardProps } from '@/components/DocumentCard';
import { toast } from 'sonner';

export const useDocuments = (userId: string | undefined) => {
  const [documents, setDocuments] = useState<DocumentCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = async () => {
    // Only try to fetch from the database if the user is authenticated
    if (userId) {
      try {
        setLoading(true);
        // Get user settings for currency
        const { data: settingsData } = await supabase
          .from('user_settings')
          .select('currency')
          .eq('user_id', userId)
          .single();
        
        const currency = settingsData?.currency || 'USD';
        
        const { data, error } = await supabase
          .from('documents')
          .select(`
            id,
            type,
            title,
            client_name,
            date,
            status,
            document_number,
            document_items(unit_price, quantity)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false }); // Sort by newest first
          
        if (error) {
          console.error('Error fetching documents:', error);
          setDocuments([]);
          return;
        }
        
        if (data && data.length > 0) {
          // Transform the data to match DocumentCardProps
          const transformedData = data.map(doc => {
            // Calculate total amount from document items
            const totalAmount = doc.document_items?.reduce((sum, item) => {
              return sum + (Number(item.quantity) * Number(item.unit_price));
            }, 0) || 0;
            
            // Extract client company from client name if available (format: "Name - Company")
            let clientName = doc.client_name;
            let clientCompany = undefined;
            
            if (doc.client_name.includes(' - ')) {
              const parts = doc.client_name.split(' - ');
              clientName = parts[0];
              clientCompany = parts[1];
            }
            
            return {
              id: doc.id,
              type: doc.type as 'quotation' | 'invoice',
              title: doc.title,
              clientName: clientName,
              clientCompany: clientCompany,
              date: doc.date,
              amount: totalAmount,
              status: doc.status as 'draft' | 'sent' | 'accepted' | 'declined' | 'paid',
              currency: currency,
              documentNumber: doc.document_number || ''
            };
          });
          
          setDocuments(transformedData);
        } else {
          // If no documents found, use empty array
          setDocuments([]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Not authenticated, use empty array
      setDocuments([]);
      setLoading(false);
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
