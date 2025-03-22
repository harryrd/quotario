import React from 'react';
import CustomizableTable from '@/components/CustomizableTable';
import { TableField, TableRow } from '@/components/table/types';

interface QuotationDetailsTableProps {
  items: {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax?: number;
  }[];
  formatCurrency: (amount: number) => string;
  total: number;
}

interface QuotationItemsTableProps {
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
  currency: string;
}

const QuotationItemsTable: React.FC<QuotationItemsTableProps | QuotationDetailsTableProps> = (props) => {
  if ('items' in props) {
    const { items, formatCurrency, total } = props;
    
    return (
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Quantity</th>
              <th className="py-2 px-4 text-right">Unit Price</th>
              <th className="py-2 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemTotal = Number(item.quantity) * Number(item.unit_price);
              return (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-4">{item.description}</td>
                  <td className="py-2 px-4 text-right">{item.quantity}</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(Number(item.unit_price))}</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(itemTotal)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-4 px-4 font-medium">Total:</td>
              <td className="text-right py-4 px-4 font-bold">{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  } else {
    const { fields, rows, onFieldsChange, onRowsChange, currency } = props;
    
    return (
      <CustomizableTable
        title="Items"
        fields={fields}
        rows={rows}
        onFieldsChange={onFieldsChange}
        onRowsChange={onRowsChange}
        currency={currency}
      />
    );
  }
};

export default QuotationItemsTable;
