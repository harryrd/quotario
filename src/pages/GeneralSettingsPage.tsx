
import React from 'react';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import GeneralSettings from '@/components/settings/GeneralSettings';

const GeneralSettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="General Settings" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="border rounded-md p-6 bg-card">
            <GeneralSettings />
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
