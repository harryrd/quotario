
import React from 'react';
import CustomizableTable from '@/components/CustomizableTable';
import { TableField, TableRow } from '@/components/table/types';

interface InvoiceItemsTableProps {
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
  currency: string;
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  fields,
  rows,
  onFieldsChange,
  onRowsChange,
  currency
}) => {
  return (
    <CustomizableTable
      title="Invoice Items"
      fields={fields}
      rows={rows}
      onFieldsChange={onFieldsChange}
      onRowsChange={onRowsChange}
      currency={currency}
    />
  );
};

export default InvoiceItemsTable;
