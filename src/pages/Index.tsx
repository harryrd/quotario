
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { FilePlus, FileText } from 'lucide-react';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Documents" 
      />
      
      <div className="flex-1 px-3 py-8 flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold mb-2">Document Management</h2>
          <p className="text-muted-foreground mb-6">
            Welcome to your document management dashboard
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button 
            className="flex-1 h-12" 
            onClick={() => navigate('/create/quotation')}
          >
            <FilePlus className="mr-2 h-5 w-5" />
            New Quotation
          </Button>
          <Button 
            className="flex-1 h-12" 
            variant="secondary" 
            onClick={() => navigate('/create/invoice')}
          >
            <FileText className="mr-2 h-5 w-5" />
            New Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
