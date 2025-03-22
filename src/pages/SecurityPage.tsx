
import React from 'react';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import SecuritySettings from '@/components/settings/SecuritySettings';

const SecurityPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Security" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="border rounded-md p-6 bg-card">
            <SecuritySettings />
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default SecurityPage;
