
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClientSelector from '@/components/clients/ClientSelector';
import { Client } from '@/types/client';
import AnimatedTransition from '@/components/AnimatedTransition';
import { DocumentDetails } from '@/types/document';

interface DocumentDetailsFormProps {
  documentType: 'quotation' | 'invoice';
  details: DocumentDetails;
  onDetailsChange: (details: DocumentDetails) => void;
  onContinue: () => void;
}

const DocumentDetailsForm: React.FC<DocumentDetailsFormProps> = ({
  documentType,
  details,
  onDetailsChange,
  onContinue
}) => {
  const handleClientSelect = (client: Client) => {
    onDetailsChange({...details, client});
  };
  
  return (
    <AnimatedTransition>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label htmlFor="title" className="text-xs">Title<span className="text-red-500">*</span></Label>
          <Input
            id="title"
            placeholder="e.g. Website Development Project"
            value={details.title}
            onChange={(e) => onDetailsChange({...details, title: e.target.value})}
            required
            className="compact-input"
          />
        </div>
        
        <div className="grid gap-1">
          <Label htmlFor="client" className="text-xs">Client<span className="text-red-500">*</span></Label>
          <ClientSelector 
            onClientSelect={handleClientSelect}
            selectedClientName={details.client?.name || ''}
          />
        </div>
        
        <div className="grid gap-1">
          <Label htmlFor="date" className="text-xs">Date<span className="text-red-500">*</span></Label>
          <Input
            id="date"
            type="date"
            value={details.date}
            onChange={(e) => onDetailsChange({...details, date: e.target.value})}
            required
            className="compact-input"
          />
        </div>
        
        {documentType === 'invoice' && (
          <div className="grid gap-1">
            <Label htmlFor="dueDate" className="text-xs">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={details.dueDate || ''}
              onChange={(e) => onDetailsChange({...details, dueDate: e.target.value})}
              className="compact-input"
            />
          </div>
        )}
        
        <div className="grid gap-1">
          <Label htmlFor="notes" className="text-xs">Notes</Label>
          <textarea
            id="notes"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Additional notes or terms..."
            value={details.notes || ''}
            onChange={(e) => onDetailsChange({...details, notes: e.target.value})}
          />
        </div>
        
        <Button 
          className="mt-2 text-xs py-1 h-8" 
          size="sm" 
          onClick={onContinue}
        >
          Continue to Items
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </AnimatedTransition>
  );
};

export default DocumentDetailsForm;
