
import React from 'react';
import CustomizableTable from '@/components/CustomizableTable';
import { TableField, TableRow } from '@/components/table/types';

// Add a new interface for consistency with QuotationItemsTable
interface InvoiceDetailsTableProps {
  items: {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax?: number;
  }[];
  formatCurrency: (amount: number) => string;
  total: number;
  showTax?: boolean;
}

interface InvoiceItemsTableProps {
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
  currency: string;
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps | InvoiceDetailsTableProps> = (props) => {
  // Check which interface we're using
  if ('items' in props) {
    // This is the InvoiceDetailsTableProps version
    const { items, formatCurrency, total, showTax = true } = props;
    
    return (
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Quantity</th>
              <th className="py-2 px-4 text-right">Unit Price</th>
              {showTax && <th className="py-2 px-4 text-right">Tax (%)</th>}
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
                  {showTax && <td className="py-2 px-4 text-right">{item.tax || 0}%</td>}
                  <td className="py-2 px-4 text-right">{formatCurrency(itemTotal)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={showTax ? 4 : 3} className="text-right py-4 px-4 font-medium">Total:</td>
              <td className="text-right py-4 px-4 font-bold">{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  } else {
    // This is the original CustomizableTable version
    const { fields, rows, onFieldsChange, onRowsChange, currency } = props;
    
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
  }
};

export default InvoiceItemsTable;
