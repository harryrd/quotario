
import React from 'react';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}

interface QuotationItemsTableProps {
  items: QuotationItem[];
  formatCurrency: (amount: number) => string;
  total: number;
}

const QuotationItemsTable: React.FC<QuotationItemsTableProps> = ({
  items,
  formatCurrency,
  total
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 font-medium">Description</th>
            <th className="text-right p-3 font-medium">Qty</th>
            <th className="text-right p-3 font-medium">Price</th>
            <th className="text-right p-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const itemTotal = item.quantity * item.unit_price;
            return (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                <td className="p-3 text-right">{formatCurrency(itemTotal)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="border-t bg-muted/50">
          <tr>
            <td colSpan={3} className="p-3 text-right font-medium">Total</td>
            <td className="p-3 text-right font-bold">{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default QuotationItemsTable;
