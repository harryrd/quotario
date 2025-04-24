
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
      <TemplateManager
        fields={fields}
        setFields={setFields}
        templateType={templateType}
        onRemoveField={onRemoveField}
      />
    </div>
  );
};

export default TabContent;
