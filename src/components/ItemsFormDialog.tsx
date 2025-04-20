
import React, { useState, useEffect, ChangeEvent } from 'react';
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

  // We no longer add new rows from dialog, so no addRow function

  // Update cell in row
  const updateCell = (rowId: string, fieldId: string, value: any) => {
    setRows(prev =>
      prev.map(row => (row.id === rowId ? { ...row, [fieldId]: value } : row))
    );
  };

  // Remove row is disabled — no close icon present now

  // For image field, handle file input change
  const handleImageChange = (rowId: string, fieldId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // For simplicity, store file object itself or URL string
    // Usually it is better to handle upload outside dialog, but here as placeholder, store object URL string
    const objectUrl = URL.createObjectURL(file);

    updateCell(rowId, fieldId, objectUrl);
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
          {/* For each row render fields as form inputs in order */}
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="border border-gray-300 rounded-md p-4 shadow-sm bg-white relative">
              <h3 className="font-semibold text-sm text-gray-700 mb-4">Item {rowIndex + 1}</h3>
              <div className="flex flex-col space-y-4">
                {fields.map(field => {
                  const value = row[field.id] ?? '';

                  if (field.type === 'image') {
                    return (
                      <div key={field.id} className="flex flex-col">
                        <label htmlFor={`${field.id}-${row.id}`} className="text-sm font-medium mb-1">{field.name}</label>
                        <input
                          id={`${field.id}-${row.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(row.id, field.id, e)}
                          className="w-full border border-gray-300 rounded px-2 py-1 cursor-pointer"
                          aria-label={field.name}
                        />
                        {/* Show preview thumbnail if image exists */}
                        {value && typeof value === 'string' && (
                          <img
                            src={value}
                            alt="Preview"
                            className="mt-2 h-24 w-auto rounded border border-gray-300 object-contain"
                          />
                        )}
                      </div>
                    );
                  } else {
                    // For other fields, show input based on type
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
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Remove Add Row button and close icon on rows */}

        <div className="mt-6 flex justify-end items-center">
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

