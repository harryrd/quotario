
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X, Loader2 } from 'lucide-react';

interface DocumentEditActionsProps {
  isEditing: boolean;
  savingChanges: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveChanges: () => Promise<void>;
}

const DocumentEditActions: React.FC<DocumentEditActionsProps> = ({
  isEditing,
  savingChanges,
  onStartEditing,
  onCancelEditing,
  onSaveChanges
}) => {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCancelEditing}
          disabled={savingChanges}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button 
          size="sm"
          onClick={onSaveChanges}
          disabled={savingChanges}
        >
          {savingChanges ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Save
            </>
          )}
        </Button>
      </div>
    );
  }
  
  return (
    <Button variant="outline" onClick={onStartEditing}>
      <Pencil className="h-4 w-4 mr-1" />
      Edit
    </Button>
  );
};

export default DocumentEditActions;
