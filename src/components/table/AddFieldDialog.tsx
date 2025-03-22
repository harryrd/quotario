
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { TableField } from './types';

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newField: Partial<TableField>;
  onNewFieldChange: (field: Partial<TableField>) => void;
  onAddField: () => void;
}

const AddFieldDialog: React.FC<AddFieldDialogProps> = ({
  open,
  onOpenChange,
  newField,
  onNewFieldChange,
  onAddField
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new field</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Field Name
            </label>
            <Input
              id="name"
              value={newField.name || ''}
              onChange={(e) => onNewFieldChange({...newField, name: e.target.value})}
              placeholder="e.g. Description, Quantity, Price..."
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Field Type
            </label>
            <select
              id="type"
              value={newField.type || 'text'}
              onChange={(e) => onNewFieldChange({...newField, type: e.target.value as any})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={newField.required || false}
              onChange={(e) => onNewFieldChange({...newField, required: e.target.checked})}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="required" className="text-sm font-medium">
              Required field
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddField}>
            Add Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldDialog;
