
import React from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Documents" 
      />
      
      <div className="flex-1 px-3 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Document Management</h2>
          <p className="text-muted-foreground mb-6">
            Welcome to your document management dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
