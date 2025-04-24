
import React from 'react';
import { type FieldTemplate } from '@/schemas/template';
import TemplateManager from './TemplateManager';

interface TabContentProps {
  fields: FieldTemplate[];
  setFields: React.Dispatch<React.SetStateAction<FieldTemplate[]>>;
  templateType: 'quotation' | 'invoice';
  onRemoveField: (fieldId: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  fields,
  setFields,
  templateType,
  onRemoveField
}) => {
  return (
    <div className="space-y-5">
      {/* We're passing different props than what TemplateManager expects.
          Let's replace this with appropriate content later. */}
      <div>
        <h3 className="text-md font-medium mb-2">Template Fields</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage the fields that will appear in your {templateType === 'quotation' ? 'quotation' : 'invoice'} template
        </p>
        
        {/* Field list rendering here */}
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">{field.name}</p>
                <p className="text-xs text-muted-foreground">{field.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                {field.id.startsWith('custom_') && (
                  <button 
                    onClick={() => onRemoveField(field.id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabContent;
