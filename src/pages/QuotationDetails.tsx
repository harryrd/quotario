
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, Building, User, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Quotation Details" 
        showBack 
      />
      
      <div className="flex-1 container max-w-4xl py-6 space-y-8">
        {/* Quotation header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">{quotation.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>Quotation #{quotation.document_number}</span>
            <span>Date: {format(new Date(quotation.date), 'PPP')}</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Business and client details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender details */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <Building className="mr-2 h-4 w-4" />
              From
            </h3>
            <div className="space-y-1">
              <p className="font-medium">{businessDetails.company_name}</p>
              {businessDetails.address && (
                <p className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4 shrink-0 mt-0.5" />
                  <span>{businessDetails.address}</span>
                </p>
              )}
              {businessDetails.phone && (
                <p className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-1 h-4 w-4 shrink-0" />
                  <span>{businessDetails.phone}</span>
                </p>
              )}
              {businessDetails.email && (
                <p className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-4 w-4 shrink-0" />
                  <span>{businessDetails.email}</span>
                </p>
              )}
              {businessDetails.website && (
                <p className="flex items-center text-sm text-muted-foreground">
                  <Globe className="mr-1 h-4 w-4 shrink-0" />
                  <span>{businessDetails.website}</span>
                </p>
              )}
            </div>
          </div>
          
          {/* Recipient details */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <User className="mr-2 h-4 w-4" />
              To
            </h3>
            <div className="space-y-1">
              <p className="font-medium">{quotation.client_name}</p>
              {quotation.client_company && (
                <p className="text-sm">{quotation.client_company}</p>
              )}
              {quotation.client_address && (
                <p className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4 shrink-0 mt-0.5" />
                  <span>{quotation.client_address}</span>
                </p>
              )}
              {quotation.client_phone && (
                <p className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-1 h-4 w-4 shrink-0" />
                  <span>{quotation.client_phone}</span>
                </p>
              )}
              {quotation.client_email && (
                <p className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-4 w-4 shrink-0" />
                  <span>{quotation.client_email}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Quotation items */}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-right p-3 font-medium">Qty</th>
                <th className="text-right p-3 font-medium">Price</th>
                <th className="text-right p-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item) => {
                const itemTotal = item.quantity * item.unit_price;
                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                    <td className="p-3 text-right">{formatCurrency(itemTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t bg-muted/50">
              <tr>
                <td colSpan={3} className="p-3 text-right font-medium">Total</td>
                <td className="p-3 text-right font-bold">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Notes */}
        {quotation.notes && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notes</h3>
            <div className="p-4 border rounded-md bg-muted/20">
              <p className="text-sm whitespace-pre-line">{quotation.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationDetails;
