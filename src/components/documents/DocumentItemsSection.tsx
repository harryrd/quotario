
import React from 'react';
import CustomizableTable from '@/components/CustomizableTable';
import { TableRow, TableField } from '@/components/table/types';
import { DocumentType } from '@/types/document';

export interface DocumentItemsSectionProps {
  documentType: DocumentType;
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: React.Dispatch<React.SetStateAction<TableField[]>>;
  onRowsChange: React.Dispatch<React.SetStateAction<TableRow[]>>;
  currency?: string;
}

const DocumentItemsSection: React.FC<DocumentItemsSectionProps> = ({
  documentType,
  fields,
  rows,
  onFieldsChange,
  onRowsChange,
  currency = 'USD'
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
