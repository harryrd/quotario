
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}

export interface Document {
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

export interface BusinessDetails {
  company_name: string;
  address: string;
  email: string;
  phone: string;
}

export const useDocumentDetails = (documentId: string | undefined, userId: string | undefined) => {
  const navigate = useNavigate();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    company_name: 'Your Company',
    address: '123 Business Street, City, State 12345',
    email: 'info@yourcompany.com',
    phone: '+1 234 567 8900'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableDocument, setEditableDocument] = useState<Document | null>(null);
  const [savingChanges, setSavingChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!documentId || !userId) return;
      
      try {
        setLoading(true);
        
        // Fetch business details
        const { data: businessData } = await supabase
          .from('business_details')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (businessData) {
          setBusinessDetails({
            company_name: businessData.company_name,
            address: businessData.address || '',
            email: businessData.email || '',
            phone: businessData.phone || ''
          });
        }
        
        // Fetch document
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
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
          .eq('document_id', documentId);
          
        if (itemsError) {
          toast.error('Error fetching document items');
          console.error('Error fetching document items:', itemsError);
          return;
        }
        
        // Ensure document type is one of the allowed types
        const documentType = documentData.type === 'invoice' ? 'invoice' : 'quotation';
        
        const fullDocument = {
          ...documentData,
          type: documentType as 'quotation' | 'invoice',
          items: itemsData || []
        };
        
        setDocument(fullDocument);
        setEditableDocument(JSON.parse(JSON.stringify(fullDocument)));
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [documentId, userId, navigate]);

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
      
      setDocument(JSON.parse(JSON.stringify(editableDocument)));
      setIsEditing(false);
      toast.success('Document updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setSavingChanges(false);
    }
  };

  const handleConvertToInvoice = async () => {
    if (!document || !userId) return;
    
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
      setEditableDocument({ ...editableDocument!, type: 'invoice' });
      toast.success('Converted quotation to invoice');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  const handlePreviewPDF = () => {
    toast.success('Preparing PDF preview...');
    // In a real app, this would generate and display a PDF
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return {
    document,
    editableDocument,
    setEditableDocument,
    businessDetails,
    loading,
    isEditing,
    savingChanges,
    handleStartEditing,
    handleCancelEditing,
    handleSaveChanges,
    handleConvertToInvoice,
    handlePreviewPDF,
    formatDate
  };
};
