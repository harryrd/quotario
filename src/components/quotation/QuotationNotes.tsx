
import React from 'react';

interface QuotationNotesProps {
  notes?: string;
}

const QuotationNotes: React.FC<QuotationNotesProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Notes</h3>
      <div className="p-4 border rounded-md bg-muted/20">
        <p className="text-sm whitespace-pre-line">{notes}</p>
      </div>
    </div>
  );
};

export default QuotationNotes;
