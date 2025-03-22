
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import QuotationHeader from '@/components/quotation/QuotationHeader';
import BusinessClientInfo from '@/components/quotation/BusinessClientInfo';
import QuotationItemsTable from '@/components/quotation/QuotationItemsTable';
import QuotationNotes from '@/components/quotation/QuotationNotes';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}

interface QuotationData {
  id: string;
  document_number: string;
  title: string;
  date: string;
  status: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  client_company?: string;
  notes?: string;
  items: QuotationItem[];
}

const QuotationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { businessDetails } = useBusinessDetails(user);
  
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch the quotation data
        const { data: quotationData, error: quotationError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
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
          .eq('document_id', id);
        
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
  }, [id, user]);

  // Format currency according to the user's settings
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD' // This should ideally come from user settings
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Quotation Details" showBack />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-opacity-50 border-t-primary rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quotation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Quotation Details" showBack />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-muted-foreground">Quotation not found or you don't have permission to view it.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/')}
            >
              Go back to Documents
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const clientInfo = {
    name: quotation.client_name,
    company: quotation.client_company,
    address: quotation.client_address,
    email: quotation.client_email,
    phone: quotation.client_phone
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Quotation Details" 
        showBack 
      />
      
      <div className="flex-1 container max-w-4xl py-6 space-y-8">
        {/* Quotation header with title, number, and date */}
        <QuotationHeader 
          title={quotation.title}
          documentNumber={quotation.document_number}
          date={quotation.date}
          status={quotation.status}
        />
        
        <Separator />
        
        {/* Business and client information */}
        <BusinessClientInfo 
          businessDetails={businessDetails}
          clientDetails={clientInfo}
        />
        
        {/* Quotation items table */}
        <QuotationItemsTable 
          items={quotation.items}
          formatCurrency={formatCurrency}
          total={total}
        />
        
        {/* Notes section */}
        <QuotationNotes notes={quotation.notes} />
      </div>
    </div>
  );
};

export default QuotationDetails;
