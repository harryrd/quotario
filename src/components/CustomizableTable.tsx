
import React, { useState } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
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
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface TableField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  required?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

interface CustomizableTableProps {
  title: string;
  fields: TableField[];
  rows: TableRow[];
  onFieldsChange: (fields: TableField[]) => void;
  onRowsChange: (rows: TableRow[]) => void;
  className?: string;
}

const CustomizableTable: React.FC<CustomizableTableProps> = ({
  title,
  fields,
  rows,
  onFieldsChange,
  onRowsChange,
  className
}) => {
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [newField, setNewField] = useState<Partial<TableField>>({
    name: '',
    type: 'text',
    required: false
  });
  
  const addField = () => {
    if (!newField.name) return;
    
    const fieldId = Date.now().toString();
    onFieldsChange([
      ...fields,
      {
        id: fieldId,
        name: newField.name,
        type: newField.type || 'text',
        required: newField.required || false
      }
    ]);
    
    // Add empty value for this field to all rows
    const updatedRows = rows.map(row => ({
      ...row,
      [fieldId]: ''
    }));
    onRowsChange(updatedRows);
    
    // Reset form
    setNewField({
      name: '',
      type: 'text',
      required: false
    });
    setFieldDialogOpen(false);
  };
  
  const removeField = (fieldId: string) => {
    onFieldsChange(fields.filter(f => f.id !== fieldId));
    
    // Remove this field from all rows
    const updatedRows = rows.map(row => {
      const newRow = {...row};
      delete newRow[fieldId];
      return newRow;
    });
    onRowsChange(updatedRows);
  };
  
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
  
  return (
    <Card className={cn("shadow-sm w-full", className)}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex gap-2">
            <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
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
                      value={newField.name}
                      onChange={(e) => setNewField({...newField, name: e.target.value})}
                      placeholder="e.g. Description, Quantity, Price..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Field Type
                    </label>
                    <select
                      id="type"
                      value={newField.type}
                      onChange={(e) => setNewField({...newField, type: e.target.value as any})}
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
                      checked={newField.required}
                      onChange={(e) => setNewField({...newField, required: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="required" className="text-sm font-medium">
                      Required field
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFieldDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addField}>
                    Add Field
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {fields.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {fields.map((field) => (
                  <TableHead key={field.id} className="px-2 py-2 first:pl-4 last:pr-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span>{field.name}</span>
                        {field.required && (
                          <Badge variant="outline" className="ml-1 px-1 py-0 h-4 text-[10px]">Required</Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <GripVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => removeField(field.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove Field</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {fields.map((field) => (
                    <TableCell key={`${row.id}-${field.id}`} className="p-0 h-[52px]">
                      {field.type === 'number' ? (
                        <Input
                          type="number"
                          value={row[field.id] || ''}
                          onChange={(e) => updateCell(row.id, field.id, e.target.value)}
                          className="border-0 focus-visible:ring-0 rounded-none h-full"
                        />
                      ) : field.type === 'date' ? (
                        <Input
                          type="date"
                          value={row[field.id] || ''}
                          onChange={(e) => updateCell(row.id, field.id, e.target.value)}
                          className="border-0 focus-visible:ring-0 rounded-none h-full"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={row[field.id] || ''}
                          onChange={(e) => updateCell(row.id, field.id, e.target.value)}
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
                      onClick={() => removeRow(row.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center py-8 px-4 text-center">
            <div>
              <p className="text-muted-foreground mb-4">No fields added yet</p>
              <Button variant="outline" onClick={() => setFieldDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Field
              </Button>
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
