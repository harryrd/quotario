
import React from 'react';
import CustomizableTable, { TableRow, TableField } from '@/components/CustomizableTable';
import { DocumentType } from '@/types/document';

export interface DocumentItemsSectionProps {
  documentType: DocumentType;
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: React.Dispatch<React.SetStateAction<TableField[]>>;
  onRowsChange: React.Dispatch<React.SetStateAction<TableRow[]>>;
  currency?: string; // Add this prop to fix the build error
}

const DocumentItemsSection: React.FC<DocumentItemsSectionProps> = ({
  documentType,
  fields,
  rows,
  onFieldsChange,
  onRowsChange,
  currency = 'USD' // Default currency if not provided
}) => {
  return (
    <div>
      <CustomizableTable
        title={`${documentType === 'quotation' ? 'Quotation' : 'Invoice'} Items`}
        fields={fields}
        rows={rows}
        onFieldsChange={onFieldsChange}
        onRowsChange={onRowsChange}
      />
    </div>
  );
};

export default DocumentItemsSection;
