
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
  editable?: boolean;
}

interface QuotationItemsTableProps {
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
  currency: string;
  editable?: boolean;
}

const QuotationItemsTable: React.FC<QuotationItemsTableProps | QuotationDetailsTableProps> = (props) => {
  if ('items' in props) {
    const { items, formatCurrency, total, editable = false } = props;
    
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
    const { fields, rows, onFieldsChange, onRowsChange, currency, editable = true } = props;
    if (!editable) {
      // Render read-only table for the rows (no editing)
      const formatCurrency = (amount: number) => {
        switch(currency) {
          case 'USD': return '$' + amount.toFixed(2);
          case 'EUR': return '€' + amount.toFixed(2);
          case 'GBP': return '£' + amount.toFixed(2);
          case 'JPY': return '¥' + amount.toFixed(2);
          case 'CAD': return 'C$' + amount.toFixed(2);
          case 'IDR': return 'Rp' + amount.toFixed(2);
          default: return currency + amount.toFixed(2);
        }
      };

      const total = rows.reduce((sum, row) => {
        const qty = parseFloat(row.qty as string) || 0;
        const price = parseFloat(row.price as string) || 0;
        return sum + qty * price;
      }, 0);

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
              {rows.map((row) => {
                const rowTotal = (parseFloat(row.qty as string) || 0) * (parseFloat(row.price as string) || 0);
                return (
                  <tr key={row.id} className="border-b">
                    <td className="py-2 px-4">{row.desc}</td>
                    <td className="py-2 px-4 text-right">{row.qty}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(parseFloat(row.price as string) || 0)}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(rowTotal)}</td>
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
    }

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

