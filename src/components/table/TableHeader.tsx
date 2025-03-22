
import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { TableField } from './types';
import { TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TableHeaderProps {
  fields: TableField[];
  onRemoveField: (fieldId: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ fields, onRemoveField }) => {
  return (
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
                <DropdownMenuItem onClick={() => onRemoveField(field.id)}>
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
  );
};

export default TableHeader;
