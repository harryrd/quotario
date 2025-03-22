
import React from 'react';
import { format } from 'date-fns';

interface QuotationHeaderProps {
  title: string;
  documentNumber: string;
  date: string;
  status: string;
}

const QuotationHeader: React.FC<QuotationHeaderProps> = ({
  title,
  documentNumber,
  date,
  status
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span>Quotation #{documentNumber}</span>
        <span>Date: {format(new Date(date), 'PPP')}</span>
      </div>
    </div>
  );
};

export default QuotationHeader;
