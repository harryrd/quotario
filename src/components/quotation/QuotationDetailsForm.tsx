
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ClientSelector from '@/components/clients/ClientSelector';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useGeneralSettings } from '@/hooks/useGeneralSettings';
import { Client } from '@/schemas/client';
import { DocumentDetails } from '@/schemas/document';

interface QuotationDetailsFormProps {
  details: DocumentDetails;
  userSettings: any;
  onTitleChange: (title: string) => void;
  onClientSelect: (client: Client | null) => void;
  onDateChange: (date: string) => void;
  onNotesChange: (notes: string) => void;
  onDocumentNumberChange: (documentNumber: string) => void;
}

const QuotationDetailsForm: React.FC<QuotationDetailsFormProps> = ({
  details,
  userSettings,
  onTitleChange,
  onClientSelect,
  onDateChange,
  onNotesChange,
  onDocumentNumberChange,
}) => {
  const { settings, loading } = useGeneralSettings();
  const [date, setDate] = React.useState<Date | undefined>(details.date ? new Date(details.date) : undefined);

  React.useEffect(() => {
    if (details.date) {
      setDate(new Date(details.date));
    }
  }, [details.date]);

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      onDateChange(format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <Card className="bg-card">
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-xs">
              Quotation Title
            </Label>
            <Input
              id="title"
              placeholder="Enter quotation title"
              value={details.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="h-9"
            />
          </div>

          <div>
            <Label htmlFor="documentNumber" className="text-xs">
              Quotation Number
            </Label>
            <Input
              id="documentNumber"
              placeholder="Enter quotation number"
              value={details.documentNumber || ''}
              onChange={(e) => onDocumentNumberChange(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client" className="text-xs">
              Client
            </Label>
            <ClientSelector
              onClientSelect={onClientSelect}
              selectedClientName={details.client?.name}
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-xs">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal h-9',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-xs">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Additional notes or terms"
            value={details.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationDetailsForm;
