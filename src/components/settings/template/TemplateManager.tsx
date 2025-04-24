
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TemplateTab, type FieldTemplate } from '@/schemas/template';

interface TemplateManagerProps {
  activeTab: TemplateTab;
  setActiveTab: (tab: TemplateTab) => void;
  // Add missing props to match usage in TabContent
  fields?: FieldTemplate[];
  setFields?: React.Dispatch<React.SetStateAction<FieldTemplate[]>>;
  templateType?: 'quotation' | 'invoice';
  onRemoveField?: (fieldId: string) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ 
  activeTab, 
  setActiveTab,
  // We don't need to use these props in this component, but they are passed from TabContent
  fields, 
  setFields, 
  templateType, 
  onRemoveField 
}) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: TemplateTab) => {
    setActiveTab(tab);
  };

  const handleBack = () => {
    navigate('/settings');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Template Settings</h2>
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          variant={activeTab === 'quotation' ? 'default' : 'outline'}
          onClick={() => handleTabChange('quotation')}
        >
          Quotation Template
        </Button>
        <Button 
          variant={activeTab === 'invoice' ? 'default' : 'outline'}
          onClick={() => handleTabChange('invoice')}
        >
          Invoice Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateManager;
