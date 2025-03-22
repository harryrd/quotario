
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyTableStateProps {
  onAddField: () => void;
}

const EmptyTableState: React.FC<EmptyTableStateProps> = ({ onAddField }) => {
  return (
    <div className="flex items-center justify-center py-8 px-4 text-center">
      <div>
        <p className="text-muted-foreground mb-4">No fields added yet</p>
        <Button variant="outline" onClick={onAddField}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Field
        </Button>
      </div>
    </div>
  );
};

export default EmptyTableState;
