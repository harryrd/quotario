
import React from 'react';
import { FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuotationActionsProps {
  onSave: () => void;
  isLoading: boolean;
}

const QuotationActions: React.FC<QuotationActionsProps> = ({
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
        Save Quotation
      </Button>
    </div>
  );
};

export default QuotationActions;
