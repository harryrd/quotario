
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableField, TableRow } from '@/components/table/types';
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
      <DialogContent className="max-w-3xl w-full max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {rows.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">No items added yet.</div>
        )}

        <div className="space-y-6">
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="border border-gray-300 rounded-md p-4 shadow-sm bg-white relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm text-gray-700">Item {rowIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label="Remove item"
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  &times;
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(field => {
                  const value = row[field.id] ?? '';
                  const commonInputProps = {
                    value,
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                      updateCell(row.id, field.id, e.target.value),
                    className: "w-full border border-gray-300 rounded px-2 py-1",
                    id: `${field.id}-${row.id}`,
                    'aria-label': field.name,
                  };

                  if (field.type === 'number') {
                    return (
                      <div key={field.id} className="flex flex-col">
                        <label htmlFor={commonInputProps.id} className="text-sm font-medium mb-1">{field.name}</label>
                        <input
                          type="number"
                          {...commonInputProps}
                          className={cn(commonInputProps.className, "text-right")}
                        />
                      </div>
                    );
                  } else if (field.type === 'date') {
                    return (
                      <div key={field.id} className="flex flex-col">
                        <label htmlFor={commonInputProps.id} className="text-sm font-medium mb-1">{field.name}</label>
                        <input
                          type="date"
                          {...commonInputProps}
                        />
                      </div>
                    );
                  } else if (field.type === 'select' && field.options) {
                    return (
                      <div key={field.id} className="flex flex-col">
                        <label htmlFor={commonInputProps.id} className="text-sm font-medium mb-1">{field.name}</label>
                        <select
                          {...commonInputProps}
                        >
                          <option value="">Select</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    );
                  } else if (field.type === 'image') {
                    // For image type, simple text input for URL or description (can be enhanced later)
                    return (
                      <div key={field.id} className="flex flex-col">
                        <label htmlFor={commonInputProps.id} className="text-sm font-medium mb-1">{field.name}</label>
                        <input
                          type="text"
                          {...commonInputProps}
                          placeholder="Image URL"
                        />
                      </div>
                    );
                  } else {
                    // default text input
                    return (
                      <div key={field.id} className="flex flex-col">
                        <label htmlFor={commonInputProps.id} className="text-sm font-medium mb-1">{field.name}</label>
                        <input
                          type="text"
                          {...commonInputProps}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
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

