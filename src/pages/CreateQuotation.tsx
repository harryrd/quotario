
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, Save, FileCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ClientSelector from '@/components/clients/ClientSelector';
import CustomizableTable from '@/components/CustomizableTable';
import { TableField, TableRow } from '@/components/table/types';
import { Client } from '@/types/client';
import { DocumentDetails } from '@/types/document';
import { useUserSettings } from '@/hooks/document/useUserSettings';
import { useDocumentSave } from '@/hooks/document/useDocumentSave';
import { FieldTemplate } from '@/components/settings/template/types';

const CreateQuotation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, loading: settingsLoading } = useUserSettings(user?.id);

  // Document save hook
  const { handleSave, isLoading, documentId, navigateToDetails } = useDocumentSave(user?.id);

  // State for document details
  const [details, setDetails] = useState<DocumentDetails>({
    title: '',
    client: null,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  // State for table fields and rows
  const [fields, setFields] = useState<TableField[]>([
    { id: 'desc', name: 'Description', type: 'text', required: true },
    { id: 'qty', name: 'Quantity', type: 'number', required: true },
    { id: 'price', name: 'Price', type: 'number', required: true },
    { id: 'tax', name: 'Tax %', type: 'number', required: false },
  ]);

  const [rows, setRows] = useState<TableRow[]>([
    { id: '1', desc: '', qty: '', price: '', tax: '' }
  ]);

  // Effect to navigate to document details page after successful save
  useEffect(() => {
    if (documentId && navigateToDetails) {
      navigate(`/document/${documentId}`);
    }
  }, [documentId, navigateToDetails, navigate]);

  // Effect to load template fields from settings
  useEffect(() => {
    if (settings?.documentTemplates?.quotation) {
      try {
        const templateFields = settings.documentTemplates.quotation.fields;
        if (Array.isArray(templateFields)) {
          // Convert template fields to table fields
          const enabledFields = templateFields
            .filter((field: FieldTemplate) => field.enabled)
            .sort((a: FieldTemplate, b: FieldTemplate) => a.position - b.position)
            .map((field: FieldTemplate) => ({
              id: field.id,
              name: field.name,
              type: field.type,
              required: field.required,
              options: field.options
            }));
          
          if (enabledFields.length > 0) {
            setFields(enabledFields);
            
            // Update rows to include all fields
            const fieldIds = enabledFields.map(f => f.id);
            setRows(prevRows => prevRows.map(row => {
              const updatedRow: TableRow = { id: row.id };
              fieldIds.forEach(id => {
                updatedRow[id] = row[id] || '';
              });
              return updatedRow;
            }));
          }
        }
      } catch (error) {
        console.error('Error setting template fields:', error);
      }
    }
  }, [settings]);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setDetails(prev => ({ ...prev, client }));
  };

  // Handle form submission
  const handleSubmitQuotation = async (status: 'draft' | 'sent') => {
    // Validate required fields
    if (!details.title) {
      toast.error('Please provide a document title');
      return;
    }

    const prefix = settings?.quotationPrefix || 'QUO-';
    const startNumber = settings?.quotationStartNumber || '1001';
    
    // Save the document
    await handleSave(
      'quotation',
      details,
      rows,
      status,
      prefix,
      startNumber
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Create New Quotation" />
      
      <div className="flex-1 container max-w-5xl py-6 space-y-8">
        {/* Document details section */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={details.title}
                onChange={e => setDetails(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
              />
            </div>
            
            <div>
              <Label>Client</Label>
              <ClientSelector
                onClientSelect={handleClientSelect}
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
                    onSelect={(date) => date && setDetails(prev => ({ 
                      ...prev, 
                      date: format(date, 'yyyy-MM-dd') 
                    }))}
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
                onChange={e => setDetails(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes or payment terms"
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
        
        {/* Items table */}
        <div>
          <h3 className="text-lg font-medium mb-4">Quotation Items</h3>
          <CustomizableTable
            title="Items"
            fields={fields}
            rows={rows}
            onFieldsChange={setFields}
            onRowsChange={setRows}
            currency={settings?.currency || 'USD'}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            className="font-medium"
            onClick={() => handleSubmitQuotation('draft')}
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            className="font-medium"
            onClick={() => handleSubmitQuotation('sent')}
            disabled={isLoading}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Save as Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuotation;
