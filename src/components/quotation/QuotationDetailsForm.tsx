
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import ClientSelector from '@/components/clients/ClientSelector';
import { Client } from '@/types/client';
import { DocumentDetails } from '@/types/document';

interface QuotationDetailsFormProps {
  details: DocumentDetails;
  userSettings?: {
    quotationPrefix?: string;
    quotationStartNumber?: string;
  };
  onTitleChange: (title: string) => void;
  onClientSelect: (client: Client) => void;
  onDateChange: (date: string) => void;
  onNotesChange: (notes: string) => void;
  onDocumentNumberChange?: (documentNumber: string) => void;
}

const QuotationDetailsForm: React.FC<QuotationDetailsFormProps> = ({
  details,
  userSettings,
  onTitleChange,
  onClientSelect,
  onDateChange,
  onNotesChange,
  onDocumentNumberChange
}) => {
  // Auto-fill document number if empty and settings are available
  useEffect(() => {
    if (
      onDocumentNumberChange && 
      (!details.documentNumber || details.documentNumber === '') && 
      userSettings?.quotationPrefix && 
      userSettings?.quotationStartNumber
    ) {
      onDocumentNumberChange(`${userSettings.quotationPrefix}${userSettings.quotationStartNumber}`);
    }
  }, [userSettings, details.documentNumber, onDocumentNumberChange]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            value={details.title}
            onChange={e => onTitleChange(e.target.value)}
            placeholder="Enter document title"
          />
        </div>
        
        <div>
          <Label htmlFor="documentNumber">Quotation Number</Label>
          <Input
            id="documentNumber"
            value={details.documentNumber || ''}
            onChange={e => onDocumentNumberChange && onDocumentNumberChange(e.target.value)}
            placeholder="e.g., QUO-001"
            disabled={!!userSettings?.quotationPrefix}
          />
        </div>
        
        <div>
          <Label>Client</Label>
          <ClientSelector
            onClientSelect={onClientSelect}
            selectedClientName={details.client?.name || ''}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10"
              >
                {details.date ? (
                  format(new Date(details.date), 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={details.date ? new Date(details.date) : undefined}
                onSelect={(date) => date && onDateChange(format(date, 'yyyy-MM-dd'))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={details.notes || ''}
            onChange={e => onNotesChange(e.target.value)}
            placeholder="Add any notes or payment terms"
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default QuotationDetailsForm;
