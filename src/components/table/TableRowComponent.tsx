
import React from 'react';
import { X } from 'lucide-react';
import { TableRow as UITableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableField, TableRow } from './types';

interface TableRowComponentProps {
  row: TableRow;
  fields: TableField[];
  onUpdateCell: (rowId: string, fieldId: string, value: any) => void;
  onRemoveRow: (rowId: string) => void;
  currency?: string;
}

const TableRowComponent: React.FC<TableRowComponentProps> = ({ 
  row, 
  fields, 
  onUpdateCell, 
  onRemoveRow,
  currency = 'USD'
}) => {
  // Format currency input
  const formatCurrencyInput = (value: string) => {
    if (!value) return '';
    
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Allow only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return numericValue;
  };

  // Handle numeric input to ensure it's valid
  const handleNumericInput = (fieldId: string, value: string) => {
    const formattedValue = fieldId === 'price' 
      ? formatCurrencyInput(value)
      : value.replace(/[^\d.]/g, '');
    
    onUpdateCell(row.id, fieldId, formattedValue);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'CAD': return 'C$';
      case 'IDR': return 'Rp';
      default: return currencyCode + ' ';
    }
  };

  return (
    <UITableRow>
      {fields.map((field) => (
        <TableCell key={`${row.id}-${field.id}`} className="p-0 h-[52px]">
          {field.type === 'number' ? (
            field.id === 'price' ? (
              <div className="relative flex items-center">
                <span className="absolute left-2 text-muted-foreground">
                  {getCurrencySymbol(currency)}
                </span>
                <Input
                  type="text"
                  value={row[field.id] || ''}
                  onChange={(e) => handleNumericInput(field.id, e.target.value)}
                  className="border-0 focus-visible:ring-0 rounded-none h-full pl-8"
                />
              </div>
            ) : (
              <Input
                type="text"
                inputMode="decimal"
                value={row[field.id] || ''}
                onChange={(e) => handleNumericInput(field.id, e.target.value)}
                className="border-0 focus-visible:ring-0 rounded-none h-full"
              />
            )
          ) : field.type === 'date' ? (
            <Input
              type="date"
              value={row[field.id] || ''}
              onChange={(e) => onUpdateCell(row.id, field.id, e.target.value)}
              className="border-0 focus-visible:ring-0 rounded-none h-full"
            />
          ) : (
            <Input
              type="text"
              value={row[field.id] || ''}
              onChange={(e) => onUpdateCell(row.id, field.id, e.target.value)}
              className="border-0 focus-visible:ring-0 rounded-none h-full"
            />
          )}
        </TableCell>
      ))}
      <TableCell className="p-0 w-[50px]">
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-full rounded-none text-muted-foreground hover:text-destructive"
          onClick={() => onRemoveRow(row.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </UITableRow>
  );
};

export default TableRowComponent;
