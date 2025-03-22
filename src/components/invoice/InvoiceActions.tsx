
import React from 'react';
import { FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceActionsProps {
  onSave: () => void;
  isLoading: boolean;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  onSave,
  isLoading
}) => {
  return (
    <div className="flex justify-end pt-4">
      <Button
        className="font-medium"
        onClick={onSave}
        disabled={isLoading}
      >
        <FileCheck className="mr-2 h-4 w-4" />
        Save Invoice
      </Button>
    </div>
  );
};

export default InvoiceActions;
