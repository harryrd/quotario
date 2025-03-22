
import React from 'react';
import DocumentItemsSection from '@/components/documents/DocumentItemsSection';
import { TableRow, TableField } from '@/components/table/types';
import { DocumentType } from '@/types/document';
import AnimatedTransition from '@/components/AnimatedTransition';

interface DocumentItemsTabProps {
  documentType: DocumentType;
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: React.Dispatch<React.SetStateAction<TableField[]>>;
  onRowsChange: React.Dispatch<React.SetStateAction<TableRow[]>>;
  currency?: string;
}

const DocumentItemsTab: React.FC<DocumentItemsTabProps> = ({
  documentType,
  fields,
  rows,
  onFieldsChange,
  onRowsChange,
  currency = 'USD'
}) => {
  return (
    <AnimatedTransition>
      <DocumentItemsSection
        documentType={documentType}
        fields={fields}
        rows={rows}
        onFieldsChange={onFieldsChange}
        onRowsChange={onRowsChange}
        currency={currency}
      />
    </AnimatedTransition>
  );
};

export default DocumentItemsTab;
