
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share, Printer, Edit, FileText, Menu, FilePlus, Pencil, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}

interface Document {
  id: string;
  type: 'quotation' | 'invoice';
  title: string;
  client_name: string;
  date: string;
  due_date?: string;
  notes?: string;
  status: string;
  items: DocumentItem[];
}

interface BusinessDetails {
  company_name: string;
  address: string;
  email: string;
  phone: string;
}

const ViewDocuments: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    company_name: 'Your Company',
    address: '123 Business Street, City, State 12345',
    email: 'info@yourcompany.com',
    phone: '+1 234 567 8900'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableDocument, setEditableDocument] = useState<Document | null>(null);
  const [savingChanges, setSavingChanges] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch business details
        const { data: businessData } = await supabase
          .from('business_details')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (businessData) {
          setBusinessDetails({
            company_name: businessData.company_name,
            address: businessData.address || '',
            email: businessData.email || '',
            phone: businessData.phone || ''
          });
        }
        
        // Fetch document
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();
          
        if (documentError) {
          toast.error('Error fetching document');
          console.error('Error fetching document:', documentError);
          return;
        }
        
        if (!documentData) {
          toast.error('Document not found');
          navigate('/');
          return;
        }
        
        // Fetch document items
        const { data: itemsData, error: itemsError } = await supabase
          .from('document_items')
          .select('*')
          .eq('document_id', id);
          
        if (itemsError) {
          toast.error('Error fetching document items');
          console.error('Error fetching document items:', itemsError);
          return;
        }
        
        // Ensure document type is one of the allowed types
        const documentType = documentData.type === 'invoice' ? 'invoice' : 'quotation';
        
        const fullDocument = {
          ...documentData,
          type: documentType as 'quotation' | 'invoice',
          items: itemsData || []
        };
        
        setDocument(fullDocument);
        setEditableDocument(JSON.parse(JSON.stringify(fullDocument)));
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user, navigate]);
  
  const handlePreviewPDF = () => {
    toast.success('Preparing PDF preview...');
    // In a real app, this would generate and display a PDF
  };
  
  const handleConvertToInvoice = async () => {
    if (!document || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .update({ type: 'invoice' })
        .eq('id', document.id)
        .select()
        .single();
        
      if (error) {
        toast.error('Failed to convert to invoice');
        console.error('Error converting to invoice:', error);
        return;
      }
      
      setDocument({ ...document, type: 'invoice' });
      setEditableDocument({ ...editableDocument!, type: 'invoice' });
      toast.success('Converted quotation to invoice');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditableDocument(JSON.parse(JSON.stringify(document)));
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!editableDocument || !user) return;
    
    try {
      setSavingChanges(true);
      
      // Update document
      const { error: documentError } = await supabase
        .from('documents')
        .update({
          title: editableDocument.title,
          client_name: editableDocument.client_name,
          date: editableDocument.date,
          due_date: editableDocument.due_date,
          notes: editableDocument.notes
        })
        .eq('id', editableDocument.id);
        
      if (documentError) {
        toast.error('Failed to update document');
        console.error('Error updating document:', documentError);
        return;
      }
      
      // Update document items
      for (const item of editableDocument.items) {
        const { error: itemError } = await supabase
          .from('document_items')
          .update({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax: item.tax
          })
          .eq('id', item.id);
          
        if (itemError) {
          toast.error('Failed to update document item');
          console.error('Error updating document item:', itemError);
          return;
        }
      }
      
      setDocument(JSON.parse(JSON.stringify(editableDocument)));
      setIsEditing(false);
      toast.success('Document updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setSavingChanges(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Loading..." showBack />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <p>Loading document...</p>
        </div>
      </div>
    );
  }
  
  if (!document || !editableDocument) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Document Not Found" showBack />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 p-4">
          <p>The document you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/')}>Go to Documents</Button>
        </div>
      </div>
    );
  }
  
  // Calculate subtotal and total
  const calculateSubtotal = (doc: Document) => {
    return doc.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unit_price));
    }, 0);
  };
  
  const calculateTax = (doc: Document) => {
    return doc.items.reduce((sum, item) => {
      const lineTotal = Number(item.quantity) * Number(item.unit_price);
      return sum + (lineTotal * (Number(item.tax || 0) / 100));
    }, 0);
  };
  
  const calculateTotal = (doc: Document) => {
    const subtotal = calculateSubtotal(doc);
    const tax = calculateTax(doc);
    return subtotal + tax;
  };
  
  const subtotal = calculateSubtotal(document);
  const tax = calculateTax(document);
  const total = calculateTotal(document);
  
  const editableSubtotal = calculateSubtotal(editableDocument);
  const editableTax = calculateTax(editableDocument);
  const editableTotal = calculateTotal(editableDocument);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={`${document.type === 'quotation' ? 'Quotation' : 'Invoice'} Details`}
        showBack
        actions={
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancelEditing}
                disabled={savingChanges}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveChanges}
                disabled={savingChanges}
              >
                {savingChanges ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleStartEditing}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )
        }
      />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="p-6 md:p-8 bg-white rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                {isEditing ? (
                  <Input
                    value={editableDocument.title}
                    onChange={(e) => setEditableDocument({...editableDocument, title: e.target.value})}
                    className="text-xl font-semibold mb-2 h-auto py-1"
                  />
                ) : (
                  <h1 className="text-xl md:text-2xl font-semibold mb-2">{document.title}</h1>
                )}
                <p className="text-muted-foreground mb-6">
                  {document.type === 'quotation' ? 'Quotation for' : 'Invoice for'} 
                  {isEditing ? (
                    <Input
                      value={editableDocument.client_name}
                      onChange={(e) => setEditableDocument({...editableDocument, client_name: e.target.value})}
                      className="mt-1 h-auto py-1"
                    />
                  ) : (
                    <> {document.client_name}</>
                  )}
                </p>
              </div>
              <Badge 
                className={`
                  uppercase px-2 py-1 
                  ${document.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : ''}
                  ${document.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
                  ${document.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                  ${document.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                  ${document.status === 'declined' ? 'bg-red-100 text-red-800' : ''}
                `}
              >
                {document.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-medium mb-1">From:</h3>
                <p>{businessDetails.company_name}</p>
                <p>{businessDetails.address}</p>
                <p>{businessDetails.email}</p>
                <p>{businessDetails.phone}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">To:</h3>
                <p>{document.client_name}</p>
                <p>Client Address</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
              <div>
                <h3 className="font-medium mb-1">Document Number:</h3>
                <p>{document.type === 'quotation' ? 'QUO-' : 'INV-'}{document.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Date:</h3>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editableDocument.date}
                    onChange={(e) => setEditableDocument({...editableDocument, date: e.target.value})}
                    className="w-full md:w-auto h-auto py-1"
                  />
                ) : (
                  <p>{formatDate(document.date)}</p>
                )}
              </div>
              {(document.due_date || isEditing) && (
                <div>
                  <h3 className="font-medium mb-1">
                    {document.type === 'quotation' ? 'Valid Until' : 'Due Date'}:
                  </h3>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editableDocument.due_date || ''}
                      onChange={(e) => setEditableDocument({...editableDocument, due_date: e.target.value})}
                      className="w-full md:w-auto h-auto py-1"
                    />
                  ) : (
                    <p>{document.due_date ? formatDate(document.due_date) : 'N/A'}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-right">Quantity</th>
                    <th className="py-2 px-4 text-right">Unit Price</th>
                    {document.type === 'invoice' && (
                      <th className="py-2 px-4 text-right">Tax (%)</th>
                    )}
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(isEditing ? editableDocument : document).items.map((item, index) => {
                    const itemTotal = Number(item.quantity) * Number(item.unit_price);
                    return (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-4">
                          {isEditing ? (
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                const updatedItems = [...editableDocument.items];
                                updatedItems[index] = {
                                  ...updatedItems[index],
                                  description: e.target.value
                                };
                                setEditableDocument({...editableDocument, items: updatedItems});
                              }}
                              className="h-auto py-1"
                            />
                          ) : (
                            item.description
                          )}
                        </td>
                        <td className="py-2 px-4 text-right">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedItems = [...editableDocument.items];
                                updatedItems[index] = {
                                  ...updatedItems[index],
                                  quantity: parseFloat(e.target.value) || 0
                                };
                                setEditableDocument({...editableDocument, items: updatedItems});
                              }}
                              className="h-auto py-1 w-20 text-right ml-auto"
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td className="py-2 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end">
                              <span className="mr-1">$</span>
                              <Input
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => {
                                  const updatedItems = [...editableDocument.items];
                                  updatedItems[index] = {
                                    ...updatedItems[index],
                                    unit_price: parseFloat(e.target.value) || 0
                                  };
                                  setEditableDocument({...editableDocument, items: updatedItems});
                                }}
                                className="h-auto py-1 w-24 text-right"
                              />
                            </div>
                          ) : (
                            `$${Number(item.unit_price).toFixed(2)}`
                          )}
                        </td>
                        {document.type === 'invoice' && (
                          <td className="py-2 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end">
                                <Input
                                  type="number"
                                  value={item.tax || 0}
                                  onChange={(e) => {
                                    const updatedItems = [...editableDocument.items];
                                    updatedItems[index] = {
                                      ...updatedItems[index],
                                      tax: parseFloat(e.target.value) || 0
                                    };
                                    setEditableDocument({...editableDocument, items: updatedItems});
                                  }}
                                  className="h-auto py-1 w-16 text-right"
                                />
                                <span className="ml-1">%</span>
                              </div>
                            ) : (
                              `${item.tax || 0}%`
                            )}
                          </td>
                        )}
                        <td className="py-2 px-4 text-right">${itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${isEditing ? editableSubtotal.toFixed(2) : subtotal.toFixed(2)}</span>
                </div>
                
                {(tax > 0 || (isEditing && editableTax > 0)) && (
                  <div className="flex justify-between py-2">
                    <span>Tax:</span>
                    <span>${isEditing ? editableTax.toFixed(2) : tax.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-t border-t-gray-200">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${isEditing ? editableTotal.toFixed(2) : total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Notes:</h3>
              {isEditing ? (
                <Textarea
                  value={editableDocument.notes || ''}
                  onChange={(e) => setEditableDocument({...editableDocument, notes: e.target.value})}
                  className="min-h-[100px]"
                  placeholder="Add notes for your client..."
                />
              ) : (
                <p className="text-muted-foreground">{document.notes || 'No notes provided.'}</p>
              )}
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <motion.div 
        className="fixed bottom-6 left-0 right-0 flex justify-center px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="w-full flex justify-center">
          <div className="flex flex-row gap-3 w-full max-w-md">
            <Button 
              className="flex-1"
              onClick={handlePreviewPDF}
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview PDF
            </Button>
            
            <Button 
              className="flex-1"
              onClick={() => toast.success('Document shared successfully')}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="h-13 w-13 p-2 aspect-square"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.success('Downloading document...')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => toast.success('Printing document...')}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
                
                {document.type === 'quotation' && (
                  <DropdownMenuItem onClick={handleConvertToInvoice}>
                    <FilePlus className="h-4 w-4 mr-2" />
                    Convert to Invoice
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewDocuments;
