
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { QuotationData, DocumentItem } from '@/schemas/document-details';

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
        
        // Fetch the client details - look for exact match by client name
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('name', quotationData.client_name)
          .eq('user_id', user.id)
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
          const itemTotal = Number(item.quantity) * Number(item.unit_price);
          calculatedTotal += itemTotal;
        });
        
        setTotal(calculatedTotal);
        
        // Ensure all required fields are present in the items
        const validItems = itemsData.map(item => ({
          id: item.id || `temp-${Date.now()}-${Math.random()}`,
          description: item.description || '',
          quantity: Number(item.quantity) || 0,
          unit_price: Number(item.unit_price) || 0,
          tax: item.tax !== undefined ? Number(item.tax) : undefined
        }));
        
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
          items: validItems
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
