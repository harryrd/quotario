
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Send, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import CustomizableTable, { TableField, TableRow } from '@/components/CustomizableTable';
import AnimatedTransition from '@/components/AnimatedTransition';

interface DocumentDetails {
  title: string;
  client: string;
  date: string;
  dueDate?: string;
  notes?: string;
}

const CreateDocument: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialType = location.state?.type || 'quotation';
  
  const [activeTab, setActiveTab] = useState('details');
  const [documentType, setDocumentType] = useState<'quotation' | 'invoice'>(initialType);
  const [details, setDetails] = useState<DocumentDetails>({
    title: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  });
  
  // Define default fields for each document type
  const defaultQuotationFields: TableField[] = [
    { id: 'desc', name: 'Description', type: 'text', required: true },
    { id: 'qty', name: 'Quantity', type: 'number', required: true },
    { id: 'price', name: 'Unit Price', type: 'number', required: true }
  ];
  
  const defaultInvoiceFields: TableField[] = [
    { id: 'desc', name: 'Description', type: 'text', required: true },
    { id: 'qty', name: 'Quantity', type: 'number', required: true },
    { id: 'price', name: 'Unit Price', type: 'number', required: true },
    { id: 'tax', name: 'Tax (%)', type: 'number' }
  ];
  
  const [fields, setFields] = useState<TableField[]>(
    documentType === 'quotation' ? defaultQuotationFields : defaultInvoiceFields
  );
  
  const [rows, setRows] = useState<TableRow[]>([
    { id: '1', desc: '', qty: '', price: '', tax: '' }
  ]);
  
  // Update fields when document type changes
  useEffect(() => {
    setFields(documentType === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
  }, [documentType]);
  
  const handleSave = (status: 'draft' | 'sent') => {
    // Validate required fields
    if (!details.title || !details.client || !details.date) {
      toast.error('Please fill in all required fields');
      setActiveTab('details');
      return;
    }
    
    // Check if table has at least one row with required fields filled
    const hasValidRow = rows.some(row => {
      return fields.every(field => {
        return !field.required || (row[field.id] && row[field.id] !== '');
      });
    });
    
    if (!hasValidRow) {
      toast.error('Please add at least one complete item to your document');
      setActiveTab('items');
      return;
    }
    
    // In a real app, you would save to a database here
    toast.success(`Your ${documentType} has been ${status === 'draft' ? 'saved' : 'sent'}`);
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <Header 
        title={`New ${documentType === 'quotation' ? 'Quotation' : 'Invoice'}`} 
        showBack
      />
      
      <div className="flex justify-center p-3">
        <div className="flex items-center bg-secondary rounded-md">
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              documentType === 'quotation' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
            onClick={() => setDocumentType('quotation')}
          >
            Quotation
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              documentType === 'invoice' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
            onClick={() => setDocumentType('invoice')}
          >
            Invoice
          </button>
        </div>
      </div>
      
      <div className="flex-1 px-3">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-3">
            <TabsTrigger value="details" className="text-xs py-1">Details</TabsTrigger>
            <TabsTrigger value="items" className="text-xs py-1">Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-0">
            <AnimatedTransition>
              <div className="grid gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="title" className="text-xs">Title<span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g. Website Development Project"
                    value={details.title}
                    onChange={(e) => setDetails({...details, title: e.target.value})}
                    required
                    className="compact-input"
                  />
                </div>
                
                <div className="grid gap-1">
                  <Label htmlFor="client" className="text-xs">Client<span className="text-red-500">*</span></Label>
                  <Input
                    id="client"
                    placeholder="Client name or company"
                    value={details.client}
                    onChange={(e) => setDetails({...details, client: e.target.value})}
                    required
                    className="compact-input"
                  />
                </div>
                
                <div className="grid gap-1">
                  <Label htmlFor="date" className="text-xs">Date<span className="text-red-500">*</span></Label>
                  <Input
                    id="date"
                    type="date"
                    value={details.date}
                    onChange={(e) => setDetails({...details, date: e.target.value})}
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
                      value={details.dueDate}
                      onChange={(e) => setDetails({...details, dueDate: e.target.value})}
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
                    value={details.notes}
                    onChange={(e) => setDetails({...details, notes: e.target.value})}
                  />
                </div>
                
                <Button 
                  className="mt-2 text-xs py-1 h-8" 
                  size="sm" 
                  onClick={() => setActiveTab('items')}
                >
                  Continue to Items
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </AnimatedTransition>
          </TabsContent>
          
          <TabsContent value="items" className="mt-0">
            <AnimatedTransition>
              <CustomizableTable
                title="Document Items"
                fields={fields}
                rows={rows}
                onFieldsChange={setFields}
                onRowsChange={setRows}
              />
              
              <div className="mt-4 flex justify-end">
                <div className="w-1/2 space-y-1">
                  <div className="flex justify-between py-1 border-b text-sm">
                    <span className="font-medium">Subtotal:</span>
                    <span>
                      ${rows.reduce((sum, row) => {
                        const qty = parseFloat(row.qty) || 0;
                        const price = parseFloat(row.price) || 0;
                        return sum + (qty * price);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  
                  {documentType === 'invoice' && rows.some(row => row.tax) && (
                    <div className="flex justify-between py-1 border-b text-sm">
                      <span className="font-medium">Tax:</span>
                      <span>
                        ${rows.reduce((sum, row) => {
                          const qty = parseFloat(row.qty) || 0;
                          const price = parseFloat(row.price) || 0;
                          const tax = parseFloat(row.tax) || 0;
                          return sum + (qty * price * tax / 100);
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-1 font-bold text-sm">
                    <span>Total:</span>
                    <span>
                      ${rows.reduce((sum, row) => {
                        const qty = parseFloat(row.qty) || 0;
                        const price = parseFloat(row.price) || 0;
                        const tax = documentType === 'invoice' ? (parseFloat(row.tax) || 0) : 0;
                        const lineTotal = qty * price;
                        return sum + lineTotal + (lineTotal * tax / 100);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          </TabsContent>
        </Tabs>
      </div>
      
      <motion.div 
        className="fixed bottom-4 left-0 right-0 flex justify-center gap-3 px-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button 
          variant="outline"
          className="flex-1 py-1 text-xs h-8"
          onClick={() => handleSave('draft')}
        >
          <Save className="h-3 w-3 mr-1" />
          Save as Draft
        </Button>
        <Button 
          className="flex-1 py-1 text-xs h-8"
          onClick={() => handleSave('sent')}
        >
          <Send className="h-3 w-3 mr-1" />
          Send Document
        </Button>
      </motion.div>
    </div>
  );
};

export default CreateDocument;
