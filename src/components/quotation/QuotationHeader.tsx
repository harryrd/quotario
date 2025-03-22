
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex justify-end">
        <Badge 
          className={`
            uppercase px-2 py-1 
            ${status === 'paid' ? 'bg-emerald-100 text-emerald-800' : ''}
            ${status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
            ${status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
            ${status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
            ${status === 'declined' ? 'bg-red-100 text-red-800' : ''}
          `}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
};

export default QuotationHeader;
