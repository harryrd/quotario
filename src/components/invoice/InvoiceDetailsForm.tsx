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

interface InvoiceDetailsFormProps {
  details: DocumentDetails;
  userSettings: any;
  onTitleChange: (title: string) => void;
  onClientSelect: (client: Client | null) => void;
  onDateChange: (date: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onNotesChange: (notes: string) => void;
  onDocumentNumberChange: (documentNumber: string) => void;
}

const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  details,
  userSettings,
  onTitleChange,
  onClientSelect,
  onDateChange,
  onDueDateChange,
  onNotesChange,
  onDocumentNumberChange,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(details.date ? new Date(details.date) : undefined);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(details.dueDate ? new Date(details.dueDate) : undefined);
  const { settings, isLoading } = useGeneralSettings();

  React.useEffect(() => {
    if (details.date) {
      setDate(new Date(details.date));
    }
    if (details.dueDate) {
      setDueDate(new Date(details.dueDate));
    }
  }, [details.date, details.dueDate]);

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  return (
    <Card>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Invoice Title"
              value={details.title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="documentNumber">Invoice Number</Label>
            <Input
              id="documentNumber"
              placeholder="Invoice Number"
              value={details.documentNumber || ''}
              onChange={(e) => onDocumentNumberChange(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Client</Label>
            <ClientSelector
              onClientSelect={(client) => onClientSelect(client)}
              selectedClientName={details.client?.name}
            />
          </div>

          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-9",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {date ? formatDate(date) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    onDateChange(formatDate(date));
                  }}
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
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-9",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                {dueDate ? formatDate(dueDate) : <span>Pick a due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  onDueDateChange(formatDate(date));
                }}
                  disabled={(date) =>
                    date < new Date()
                  }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Invoice Notes"
            value={details.notes || ''}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDetailsForm;
