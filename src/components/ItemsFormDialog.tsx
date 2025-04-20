
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableField, TableRow } from '@/components/table/types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ItemsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: TableField[];
  initialRows: TableRow[];
  onSave: (rows: TableRow[]) => void;
  title?: string;
}

const ItemsFormDialog: React.FC<ItemsFormDialogProps> = ({
  open,
  onOpenChange,
  fields,
  initialRows,
  onSave,
  title = 'Add Items'
}) => {
  const [rows, setRows] = useState<TableRow[]>([]);

  useEffect(() => {
    setRows(initialRows.length > 0 ? initialRows : [{ id: Date.now().toString() }]);
  }, [initialRows, open]);

  // Add a blank row
  const addRow = () => {
    const newRow: TableRow = { id: Date.now().toString() };
    fields.forEach(field => {
      newRow[field.id] = '';
    });
    setRows(prev => [...prev, newRow]);
  };

  // Update cell in row
  const updateCell = (rowId: string, fieldId: string, value: any) => {
    setRows(prev =>
      prev.map(row => (row.id === rowId ? { ...row, [fieldId]: value } : row))
    );
  };

  // Remove row
  const removeRow = (rowId: string) => {
    setRows(prev => prev.filter(row => row.id !== rowId));
  };

  // Handle save click
  const handleSaveClick = () => {
    // Filter out empty rows (all fields empty)
    const filteredRows = rows.filter(row =>
      fields.some(field => {
        const val = row[field.id];
        return val !== '' && val !== null && val !== undefined;
      })
    );
    onSave(filteredRows);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                {fields.map(field => (
                  <th
                    key={field.id}
                    className={cn(
                      "text-left py-2 px-3 border-r border-gray-300",
                      field.id === fields[fields.length - 1].id ? 'border-r-0' : ''
                    )}
                  >
                    {field.name}
                  </th>
                ))}
                <th className="w-12 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-300">
                  {fields.map(field => {
                    const value = row[field.id] ?? '';
                    return (
                      <td key={field.id} className="py-1 px-2 border-r border-gray-300">
                        {field.type === 'number' ? (
                          <input
                            type="number"
                            value={value}
                            onChange={e => updateCell(row.id, field.id, e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-right"
                          />
                        ) : field.type === 'date' ? (
                          <input
                            type="date"
                            value={value}
                            onChange={e => updateCell(row.id, field.id, e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          />
                        ) : field.type === 'select' && field.options ? (
                          <select
                            value={value}
                            onChange={e => updateCell(row.id, field.id, e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="">Select</option>
                            {field.options.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={e => updateCell(row.id, field.id, e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          />
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                      aria-label="Remove item"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <Button variant="outline" onClick={addRow}>
            Add Row
          </Button>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSaveClick}>Save</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemsFormDialog;

