
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
}

const TableRowComponent: React.FC<TableRowComponentProps> = ({ 
  row, 
  fields, 
  onUpdateCell, 
  onRemoveRow 
}) => {
  return (
    <UITableRow>
      {fields.map((field) => (
        <TableCell key={`${row.id}-${field.id}`} className="p-0 h-[52px]">
          {field.type === 'number' ? (
            <Input
              type="number"
              value={row[field.id] || ''}
              onChange={(e) => onUpdateCell(row.id, field.id, e.target.value)}
              className="border-0 focus-visible:ring-0 rounded-none h-full"
            />
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
