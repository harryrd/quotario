
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import QuotationHeader from '@/components/quotation/QuotationHeader';
import BusinessClientInfo from '@/components/quotation/BusinessClientInfo';
import QuotationItemsTable from '@/components/quotation/QuotationItemsTable';
import QuotationNotes from '@/components/quotation/QuotationNotes';
import QuotationLoadingState from '@/components/quotation/QuotationLoadingState';
import { useQuotationDetails } from '@/hooks/quotation/useQuotationDetails';

// Fix the TypeScript error by ensuring items are properly mapped with all required fields
const QuotationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { businessDetails } = useBusinessDetails(user);
  
  const { quotation, loading, total, formatCurrency } = useQuotationDetails(id, user);

  // Custom back handler to return to the documents page
  const handleBack = () => {
    navigate('/');
  };

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
    company: quotation.client_company || '',
    address: quotation.client_address || '',
    email: quotation.client_email || '',
    phone: quotation.client_phone || ''
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Quotation Details" 
        showBack 
        onBack={handleBack}
      />
      
      <div className="flex-1 container max-w-4xl py-6 space-y-8">
        <QuotationHeader 
          title={quotation.title}
          documentNumber={quotation.document_number}
          date={quotation.date}
          status={quotation.status}
        />
        
        <Separator />
        
        <BusinessClientInfo 
          businessDetails={businessDetails}
          clientDetails={clientInfo}
        />
        
        {/* Ensure items are properly mapped with required fields */}
        <QuotationItemsTable 
          items={quotation.items.map(item => ({
            id: item.id || `temp-${Date.now()}-${Math.random()}`,
            description: item.description || '',
            quantity: Number(item.quantity) || 0,
            unit_price: Number(item.unit_price) || 0,
            tax: item.tax
          }))}
          formatCurrency={formatCurrency}
          total={total}
        />
        
        <QuotationNotes notes={quotation.notes} />
      </div>
    </div>
  );
};

export default QuotationDetails;
