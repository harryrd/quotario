
import React from 'react';
import AddCustomFieldDialog from './AddCustomFieldDialog';

interface CustomFieldSectionProps {
  canAddCustomField: boolean;
  onAddField: (name: string, type: 'text' | 'image') => void;
}

const CustomFieldSection: React.FC<CustomFieldSectionProps> = ({
  canAddCustomField,
  onAddField
}) => {
  return (
    <div className="border rounded-md p-4 bg-muted/30 flex flex-col items-start">
      <h3 className="text-base font-semibold mb-3">Add Custom Field</h3>
      {!canAddCustomField && (
        <p className="text-sm text-destructive mb-3">
          You have reached the maximum of 3 custom fields per template.
        </p>
      )}
      <AddCustomFieldDialog onAddField={onAddField} disabled={!canAddCustomField} />
    </div>
  );
};

export default CustomFieldSection;
