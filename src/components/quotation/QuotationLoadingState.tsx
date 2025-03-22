
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

interface QuotationLoadingStateProps {
  loading?: boolean;
  notFound?: boolean;
}

const QuotationLoadingState: React.FC<QuotationLoadingStateProps> = ({
  loading = false,
  notFound = false
}) => {
  const navigate = useNavigate();

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

  if (notFound) {
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

  return null;
};

export default QuotationLoadingState;
