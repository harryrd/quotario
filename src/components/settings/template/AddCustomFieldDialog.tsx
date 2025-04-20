
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddCustomFieldDialogProps {
  onAddField: (name: string, type: 'text' | 'image') => void;
  disabled?: boolean;
}

const AddCustomFieldDialog: React.FC<AddCustomFieldDialogProps> = ({ onAddField, disabled }) => {
  const [open, setOpen] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'image'>('text');

  const resetForm = () => {
    setFieldName('');
    setFieldType('text');
  };

  const handleAdd = () => {
    if (fieldName.trim() === '') {
      toast.error('Custom field name cannot be empty');
      return;
    }
    onAddField(fieldName.trim(), fieldType);
    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline">Add Custom Field</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add a Custom Field</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="custom-field-name" className="text-sm font-medium">
              Field Name
            </label>
            <Input
              id="custom-field-name"
              placeholder="Enter field name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="custom-field-type" className="text-sm font-medium">
              Field Type
            </label>
            <select
              id="custom-field-type"
              className="rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as 'text' | 'image')}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomFieldDialog;

