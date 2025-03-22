
import React from 'react';
import { Input } from '@/components/ui/input';
import { DocumentItem } from '@/pages/ViewDocuments';

interface DocumentItemsTableProps {
  items: DocumentItem[];
  documentType: 'quotation' | 'invoice';
  isEditing: boolean;
  onItemsChange?: (items: DocumentItem[]) => void;
}

const DocumentItemsTable: React.FC<DocumentItemsTableProps> = ({
  items,
  documentType,
  isEditing,
  onItemsChange
}) => {
  const handleItemChange = (index: number, field: keyof DocumentItem, value: any) => {
    if (!onItemsChange) return;
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : parseFloat(value) || 0
    };
    onItemsChange(updatedItems);
  };

  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-right">Quantity</th>
            <th className="py-2 px-4 text-right">Unit Price</th>
            {documentType === 'invoice' && (
              <th className="py-2 px-4 text-right">Tax (%)</th>
            )}
            <th className="py-2 px-4 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const itemTotal = Number(item.quantity) * Number(item.unit_price);
            return (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">
                  {isEditing ? (
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="h-auto py-1"
                    />
                  ) : (
                    item.description
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="h-auto py-1 w-20 text-right ml-auto"
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end">
                      <span className="mr-1">$</span>
                      <Input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                        className="h-auto py-1 w-24 text-right"
                      />
                    </div>
                  ) : (
                    `$${Number(item.unit_price).toFixed(2)}`
                  )}
                </td>
                {documentType === 'invoice' && (
                  <td className="py-2 px-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end">
                        <Input
                          type="number"
                          value={item.tax || 0}
                          onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                          className="h-auto py-1 w-16 text-right"
                        />
                        <span className="ml-1">%</span>
                      </div>
                    ) : (
                      `${item.tax || 0}%`
                    )}
                  </td>
                )}
                <td className="py-2 px-4 text-right">${itemTotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentItemsTable;
