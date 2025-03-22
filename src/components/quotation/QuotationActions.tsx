
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
    <div className="flex justify-center pt-6 pb-10 px-4">
      <Button
        className="font-medium w-full max-w-md"
        onClick={onSave}
        disabled={isLoading}
        size="lg"
      >
        <FileCheck className="mr-2 h-4 w-4" />
        Save Quotation
      </Button>
    </div>
  );
};

export default QuotationActions;
