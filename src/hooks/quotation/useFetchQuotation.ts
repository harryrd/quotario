
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { QuotationData, QuotationItem } from '@/types/document-details';

export const useFetchQuotation = (quotationId: string | undefined, user: User | null) => {
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      if (!quotationId || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch the quotation data
        const { data: quotationData, error: quotationError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', quotationId)
          .eq('user_id', user.id)
          .eq('type', 'quotation')
          .single();
        
        if (quotationError) {
          console.error('Error fetching quotation:', quotationError);
          return;
        }
        
        // Fetch the client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('name', quotationData.client_name)
          .maybeSingle();
        
        if (clientError && clientError.code !== 'PGRST116') {
          console.error('Error fetching client:', clientError);
        }
        
        // Fetch the quotation items
        const { data: itemsData, error: itemsError } = await supabase
          .from('document_items')
          .select('*')
          .eq('document_id', quotationId);
        
        if (itemsError) {
          console.error('Error fetching quotation items:', itemsError);
          return;
        }
        
        // Calculate total
        let calculatedTotal = 0;
        itemsData.forEach((item) => {
          const itemTotal = item.quantity * item.unit_price;
          calculatedTotal += itemTotal;
        });
        
        setTotal(calculatedTotal);
        
        // Combine all data
        setQuotation({
          id: quotationData.id,
          document_number: quotationData.document_number || 'N/A',
          title: quotationData.title,
          date: quotationData.date,
          status: quotationData.status,
          client_name: quotationData.client_name,
          client_email: clientData?.email || '',
          client_phone: clientData?.phone || '',
          client_address: clientData?.address || '',
          client_company: clientData?.company || '',
          notes: quotationData.notes,
          items: itemsData
        });
      } catch (error) {
        console.error('Error fetching quotation details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuotationDetails();
  }, [quotationId, user, navigate]);

  return {
    quotation,
    loading,
    total
  };
};
