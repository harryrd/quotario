
import React from 'react';
import { TableField, TableRow } from '@/components/table/types';
import CustomizableTable from '@/components/table/CustomizableTable';

interface QuotationItemsTableProps {
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
  currency: string;
}

const QuotationItemsTable: React.FC<QuotationItemsTableProps> = ({
  fields,
  rows,
  onFieldsChange,
  onRowsChange,
  currency
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Quotation Items</h3>
      <CustomizableTable
        title="Items"
        fields={fields}
        rows={rows}
        onFieldsChange={onFieldsChange}
        onRowsChange={onRowsChange}
        currency={currency}
      />
    </div>
  );
};

export default QuotationItemsTable;
