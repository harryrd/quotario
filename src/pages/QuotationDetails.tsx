
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import QuotationHeader from '@/components/quotation/QuotationHeader';
import BusinessClientInfo from '@/components/quotation/BusinessClientInfo';
import QuotationItemsTable from '@/components/quotation/QuotationItemsTable';
import QuotationNotes from '@/components/quotation/QuotationNotes';
import QuotationLoadingState from '@/components/quotation/QuotationLoadingState';
import { useQuotationDetails } from '@/hooks/useQuotationDetails';

const QuotationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { businessDetails } = useBusinessDetails(user);
  
  const { quotation, loading, total, formatCurrency } = useQuotationDetails(id, user);

  // Show loading state while fetching data
  if (loading) {
    return <QuotationLoadingState loading />;
  }

  // Show not found state if quotation is null
  if (!quotation) {
    return <QuotationLoadingState notFound />;
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
