
import React from 'react';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import TemplateSettings from '@/components/settings/template/TemplateSettings';

const TemplateSettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Template Settings" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="border rounded-md p-6 bg-card">
            <TemplateSettings />
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default TemplateSettingsPage;
