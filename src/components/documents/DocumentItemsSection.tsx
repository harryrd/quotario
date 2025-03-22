
import React from 'react';
import CustomizableTable, { TableField, TableRow } from '@/components/CustomizableTable';
import AnimatedTransition from '@/components/AnimatedTransition';

interface DocumentItemsSectionProps {
  documentType: 'quotation' | 'invoice';
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
}

const DocumentItemsSection: React.FC<DocumentItemsSectionProps> = ({
  documentType,
  fields,
  rows,
  onFieldsChange,
  onRowsChange
}) => {
  return (
    <AnimatedTransition>
      <CustomizableTable
        title="Document Items"
        fields={fields}
        rows={rows}
        onFieldsChange={onFieldsChange}
        onRowsChange={onRowsChange}
      />
      
      <div className="mt-4 flex justify-end">
        <div className="w-1/2 space-y-1">
          <div className="flex justify-between py-1 border-b text-sm">
            <span className="font-medium">Subtotal:</span>
            <span>
              ${rows.reduce((sum, row) => {
                const qty = parseFloat(row.qty) || 0;
                const price = parseFloat(row.price) || 0;
                return sum + (qty * price);
              }, 0).toFixed(2)}
            </span>
          </div>
          
          {documentType === 'invoice' && rows.some(row => row.tax) && (
            <div className="flex justify-between py-1 border-b text-sm">
              <span className="font-medium">Tax:</span>
              <span>
                ${rows.reduce((sum, row) => {
                  const qty = parseFloat(row.qty) || 0;
                  const price = parseFloat(row.price) || 0;
                  const tax = parseFloat(row.tax) || 0;
                  return sum + (qty * price * tax / 100);
                }, 0).toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between py-1 font-bold text-sm">
            <span>Total:</span>
            <span>
              ${rows.reduce((sum, row) => {
                const qty = parseFloat(row.qty) || 0;
                const price = parseFloat(row.price) || 0;
                const tax = documentType === 'invoice' ? (parseFloat(row.tax) || 0) : 0;
                const lineTotal = qty * price;
                return sum + lineTotal + (lineTotal * tax / 100);
              }, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default DocumentItemsSection;
