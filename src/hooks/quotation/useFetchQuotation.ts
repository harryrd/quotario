import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessDetails, Document, DocumentItem as QuotationItem } from '@/schemas/document-details';

interface UseQuotationDetailsResult {
  quotation: Document | null;
  loading: boolean;
  total: number;
  formatCurrency: (amount: number) => string;
}

export const useQuotationDetails = (quotationId: string | undefined, user: any): UseQuotationDetailsResult => {
  const [quotation, setQuotation] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      if (!quotationId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: quotationData, error: quotationError } = await supabase
          .from('documents')
          .select(`
            id,
            document_number,
            title,
            date,
            status,
            client_name,
            client_email,
            client_phone,
            client_address,
            client_company,
            notes,
            type,
            document_items (
              id,
              description,
              quantity,
              unit_price,
              tax
            )
          `)
          .eq('id', quotationId)
          .eq('user_id', user.id)
          .single();

        if (quotationError) {
          console.error('Error fetching quotation details:', quotationError);
          toast.error('Failed to load quotation details.');
          return;
        }

        if (!quotationData) {
          toast.error('Quotation not found.');
          return;
        }

        // Transform document_items to items array
        const items = quotationData.document_items.map((item: any) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax: item.tax || 0,
        }));

        // Calculate total
        const calculatedTotal = items.reduce((sum: number, item: QuotationItem) => {
          const itemTotal = item.quantity * item.unit_price;
          return sum + itemTotal;
        }, 0);

        setTotal(calculatedTotal);

        // Set quotation details
        setQuotation({
          id: quotationData.id,
          document_number: quotationData.document_number || '',
          title: quotationData.title,
          date: quotationData.date,
          status: quotationData.status,
          client_name: quotationData.client_name,
          client_email: quotationData.client_email,
          client_phone: quotationData.client_phone,
          client_address: quotationData.client_address,
          client_company: quotationData.client_company,
          notes: quotationData.notes,
          type: quotationData.type,
          items: items,
        } as Document);
      } catch (error) {
        console.error('Unexpected error fetching quotation details:', error);
        toast.error('Failed to load quotation details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationDetails();
  }, [quotationId, user]);

  const formatCurrency = (amount: number) => {
    switch(user?.user_metadata?.currency) {
      case 'USD': return '$' + amount.toFixed(2);
      case 'EUR': return '€' + amount.toFixed(2);
      case 'GBP': return '£' + amount.toFixed(2);
      case 'JPY': return '¥' + amount.toFixed(2);
      case 'CAD': return 'C$' + amount.toFixed(2);
      case 'IDR': return 'Rp' + amount.toFixed(2);
      default: return amount.toFixed(2) + ' ' + user?.user_metadata?.currency;
    }
  };

  return { quotation, loading, total, formatCurrency };
};
