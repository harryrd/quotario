import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { DocumentItem, Document, BusinessDetails } from '@/schemas/document-details';

export const useFetchDocument = (documentId: string | undefined, userId: string | undefined) => {
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    company_name: 'Your Company',
    address: '123 Business Street, City, State 12345',
    email: 'info@yourcompany.com',
    phone: '+1 234 567 8900'
  });

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
        
        // Fetch client information
        const { data: clientData } = await supabase
          .from('clients')
          .select('*')
          .eq('name', documentData.client_name)
          .eq('user_id', userId)
          .maybeSingle();
        
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
        
        // Enhance document with client information if available
        const enhancedDocument = {
          ...documentData,
          client_address: clientData?.address || '',
          client_email: clientData?.email || '',
          client_phone: clientData?.phone || '',
          client_company: clientData?.company || ''
        };
        
        // Ensure document type is one of the allowed types
        const documentType = documentData.type === 'invoice' ? 'invoice' : 'quotation';
        
        const fullDocument: Document = {
          ...enhancedDocument,
          type: documentType as 'quotation' | 'invoice',
          items: itemsData || []
        };
        
        setDocument(fullDocument);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [documentId, userId, navigate]);

  return {
    document,
    businessDetails,
    loading
  };
};
