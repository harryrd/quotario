
import { useState } from 'react';
import { DocumentType, DocumentDetails } from '@/types/document';
import { TableRow } from '@/components/table/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDocumentSave = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const handleSave = async (
    documentType: DocumentType,
    details: DocumentDetails,
    rows: TableRow[],
    status: 'draft' | 'sent'
  ) => {
    // Validate required fields
    if (!details.title || !details.client || !details.date) {
      toast.error('Please fill in all required fields');
      return null;
    }
    
    // Check if table has at least one valid row
    const hasValidRow = rows.some(row => {
      return row.desc && row.qty && row.price;
    });
    
    if (!hasValidRow) {
      toast.error('Please add at least one complete item to your document');
      return null;
    }

    // Save document to database if user is logged in
    if (userId) {
      setIsLoading(true);
      try {
        // Insert document
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .insert({
            user_id: userId,
            type: documentType,
            title: details.title,
            client_name: details.client?.name || '',
            date: details.date,
            due_date: details.dueDate || null,
            notes: details.notes || null,
            status: status
          })
          .select('id')
          .single();
        
        if (documentError) {
          throw documentError;
        }
        
        // Set document ID for redirection
        setDocumentId(documentData.id);
        
        // Insert document items
        const documentItems = rows
          .filter(row => row.desc && row.qty && row.price) // Only save valid rows
          .map(row => ({
            document_id: documentData.id,
            description: row.desc,
            quantity: Number(row.qty),
            unit_price: Number(row.price),
            tax: row.tax ? Number(row.tax) : null
          }));
        
        if (documentItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('document_items')
            .insert(documentItems);
          
          if (itemsError) {
            throw itemsError;
          }
        }
        
        toast.success(`Your ${documentType} has been ${status === 'draft' ? 'saved' : 'sent'}`);
        return documentData.id;
      } catch (error) {
        console.error(`Error saving ${documentType}:`, error);
        toast.error(`Failed to save ${documentType}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demo mode without saving to database
      toast.success(`Your ${documentType} has been ${status === 'draft' ? 'saved' : 'sent'}`);
      return 'demo-id';
    }
  };

  return {
    isLoading,
    documentId,
    handleSave
  };
};
