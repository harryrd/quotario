
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/schemas/document-details';

export const useDocumentEdit = (document: Document | null, userId: string | undefined) => {
  const [editableDocument, setEditableDocument] = useState<Document | null>(document ? JSON.parse(JSON.stringify(document)) : null);
  const [isEditing, setIsEditing] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  // Update editable document when source document changes
  if (document && (!editableDocument || document.id !== editableDocument.id)) {
    setEditableDocument(JSON.parse(JSON.stringify(document)));
  }

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditableDocument(JSON.parse(JSON.stringify(document)));
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!editableDocument || !userId) return;
    
    try {
      setSavingChanges(true);
      
      // Update document
      const { error: documentError } = await supabase
        .from('documents')
        .update({
          title: editableDocument.title,
          client_name: editableDocument.client_name,
          date: editableDocument.date,
          due_date: editableDocument.due_date,
          notes: editableDocument.notes
        })
        .eq('id', editableDocument.id);
        
      if (documentError) {
        toast.error('Failed to update document');
        console.error('Error updating document:', documentError);
        return;
      }
      
      // Update document items
      for (const item of editableDocument.items) {
        const { error: itemError } = await supabase
          .from('document_items')
          .update({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax: item.tax
          })
          .eq('id', item.id);
          
        if (itemError) {
          toast.error('Failed to update document item');
          console.error('Error updating document item:', itemError);
          return;
        }
      }
      
      toast.success('Document updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setSavingChanges(false);
    }
  };

  return {
    editableDocument,
    setEditableDocument,
    isEditing,
    savingChanges,
    handleStartEditing,
    handleCancelEditing,
    handleSaveChanges
  };
};
