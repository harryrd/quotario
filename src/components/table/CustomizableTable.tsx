
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableHeader,
  TableRow as UITableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TableField, TableRow } from './types';
import TableHeaderComponent from './TableHeader';
import TableRowComponent from './TableRowComponent';
import EmptyTableState from './EmptyTableState';

export interface CustomizableTableProps {
  title: string;
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
  className?: string;
  currency?: string;
}

const CustomizableTable: React.FC<CustomizableTableProps> = ({
  title,
  fields,
  rows,
  onFieldsChange,
  onRowsChange,
  className,
  currency = 'USD'
}) => {
  const [total, setTotal] = useState<number>(0);

  // Calculate the total whenever rows change
  useEffect(() => {
    let calculatedTotal = 0;
    rows.forEach(row => {
      const qty = parseFloat(row.qty) || 0;
      const price = parseFloat(row.price) || 0;
      calculatedTotal += qty * price;
    });
    setTotal(calculatedTotal);
  }, [rows]);

  const addRow = () => {
    const rowData: TableRow = { id: Date.now().toString() };
    fields.forEach(field => {
      rowData[field.id] = '';
    });
    onRowsChange([...rows, rowData]);
  };
  
  const removeRow = (rowId: string) => {
    onRowsChange(rows.filter(r => r.id !== rowId));
  };
  
  const updateCell = (rowId: string, fieldId: string, value: any) => {
    const updatedRows = rows.map(row => {
      if (row.id === rowId) {
        return { ...row, [fieldId]: value };
      }
      return row;
    });
    onRowsChange(updatedRows);
  };

  // Format currency according to the user's settings
  const formatCurrency = (amount: number) => {
    const currencySymbol = getCurrencySymbol(currency);
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  // Helper function to get the currency symbol
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
    <Card className={cn("shadow-sm w-full", className)}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {fields.length > 0 ? (
          <Table>
            <TableHeader>
              <TableHeaderComponent 
                fields={fields} 
                onRemoveField={() => {}} // Disabled field removal
              />
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRowComponent
                  key={row.id}
                  row={row}
                  fields={fields}
                  onUpdateCell={updateCell}
                  onRemoveRow={removeRow}
                  currency={currency}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyTableState onAddField={() => {}} />
        )}
        
        {/* Total Section */}
        {fields.length > 0 && rows.length > 0 && (
          <div className="border-t p-3">
            <div className="flex justify-end items-center">
              <div className="text-right">
                <div className="flex justify-between gap-8">
                  <span className="font-medium text-sm">Total:</span>
                  <span className="font-bold text-sm">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {fields.length > 0 && (
        <CardFooter className="flex justify-center p-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={addRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CustomizableTable;
