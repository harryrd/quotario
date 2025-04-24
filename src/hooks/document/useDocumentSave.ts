
import { useState } from 'react';
import { type DocumentType, type DocumentDetails } from '@/schemas/document';
import { type TableRow } from '@/schemas/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDocumentSave = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [navigateToDetails, setNavigateToDetails] = useState(false);

  const getNextDocumentNumber = async (
    documentType: DocumentType,
    prefix: string,
    startNumber: string
  ) => {
    if (!userId) {
      // In demo mode, just use the start number
      return startNumber;
    }

    try {
      // Find the highest document number in the database
      const { data, error } = await supabase
        .from('documents')
        .select('document_number')
        .eq('user_id', userId)
        .eq('type', documentType)
        .not('document_number', 'is', null)
        .order('document_number', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error getting latest document number:', error);
        return startNumber;
      }

      if (data && data.length > 0 && data[0]?.document_number) {
        // Extract the numeric part (assuming format is PREFIX-NUMBER)
        const latestNumber = data[0].document_number;
        const matches = latestNumber.match(/(\d+)$/);
        
        if (matches && matches[1]) {
          const numericPart = parseInt(matches[1], 10);
          return (numericPart + 1).toString();
        }
      }
      
      // If no previous document or couldn't parse number, use start number
      return startNumber;
    } catch (error) {
      console.error('Error in getNextDocumentNumber:', error);
      return startNumber;
    }
  };

  const handleSave = async (
    documentType: DocumentType,
    details: DocumentDetails,
    rows: TableRow[],
    status: 'draft' | 'sent',
    prefix: string = documentType === 'quotation' ? 'QUO-' : 'INV-',
    startNumber: string = '1001'
  ) => {
    // Validate required fields - less strict validation
    if (!details.title) {
      toast.error('Please provide a document title');
      return null;
    }
    
    // Check if there's at least one row with some data (not requiring complete rows)
    const hasAnyRow = rows.length > 0;
    
    if (!hasAnyRow) {
      toast.error('Please add at least one item to your document');
      return null;
    }

    // Set navigation flag based on status
    setNavigateToDetails(status === 'sent');

    // Save document to database if user is logged in
    if (userId) {
      setIsLoading(true);
      try {
        // Get next document number
        const nextNumber = await getNextDocumentNumber(documentType, prefix, startNumber);
        const documentNumber = `${prefix}${nextNumber}`;
        
        // Insert document - removed the 'amount' field which doesn't exist in the table
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .insert({
            user_id: userId,
            type: documentType,
            document_number: documentNumber,
            title: details.title,
            client_name: details.client?.name || '',
            date: details.date || new Date().toISOString().split('T')[0],
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
        
        // Insert document items - properly convert string values to numbers
        const documentItems = rows.map(row => {
          // Parse numeric values, ensuring they are valid numbers
          const quantity = parseFloat(row.qty as string) || 0;
          const unitPrice = parseFloat(row.price as string) || 0;
          const tax = row.tax ? parseFloat(row.tax as string) || 0 : null;
          
          return {
            document_id: documentData.id,
            description: row.desc || '',
            quantity: quantity,
            unit_price: unitPrice,
            tax: tax
          };
        });
        
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
      setNavigateToDetails(status === 'sent');
      return 'demo-id';
    }
  };

  return {
    isLoading,
    documentId,
    navigateToDetails,
    handleSave
  };
};
