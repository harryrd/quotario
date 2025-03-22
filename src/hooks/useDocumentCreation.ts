
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DocumentType, DocumentDetails } from '@/types/document';
import { TableField, TableRow } from '@/components/CustomizableTable';
import { Client } from '@/types/client';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

export interface UserSettings {
  currency: string;
  quotationPrefix: string;
  quotationStartNumber: string;
  invoicePrefix: string;
  invoiceStartNumber: string;
}

export const useDocumentCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialType = location.state?.type || 'quotation';
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('details');
  const [documentType, setDocumentType] = useState<DocumentType>(initialType);
  const [details, setDetails] = useState<DocumentDetails>({
    title: '',
    client: null,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    currency: 'USD',
    quotationPrefix: 'QUO-',
    quotationStartNumber: '1001',
    invoicePrefix: 'INV-',
    invoiceStartNumber: '1001'
  });
  
  const [fields, setFields] = useState<TableField[]>(
    documentType === 'quotation' ? defaultQuotationFields : defaultInvoiceFields
  );
  
  const [rows, setRows] = useState<TableRow[]>([
    { id: '1', desc: '', qty: '', price: '', tax: '' }
  ]);

  // Fetch user settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user settings:', error);
          return;
        }
        
        if (data) {
          setUserSettings({
            currency: data.currency || 'USD',
            quotationPrefix: data.quotation_prefix || 'QUO-',
            quotationStartNumber: data.quotation_start_number || '1001',
            invoicePrefix: data.invoice_prefix || 'INV-',
            invoiceStartNumber: data.invoice_start_number || '1001'
          });
        }
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  // Update fields when document type changes
  useEffect(() => {
    setFields(documentType === 'quotation' ? defaultQuotationFields : defaultInvoiceFields);
  }, [documentType]);
  
  const handleClientSelect = (client: Client) => {
    setDetails(prev => ({ ...prev, client }));
  };

  const handleTypeChange = (type: DocumentType) => {
    setDocumentType(type);
  };
  
  const handleDetailsChange = (updatedDetails: DocumentDetails) => {
    setDetails(updatedDetails);
  };
  
  const handleSave = async (status: 'draft' | 'sent') => {
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

    // Save document to database if user is logged in
    if (user) {
      setIsLoading(true);
      try {
        // Insert document
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            type: documentType,
            title: details.title,
            client_name: details.client?.name || '',
            date: details.date,
            due_date: details.dueDate || null,
            notes: details.notes || null,
            status: status
          })
          .select('id')
          .single();
        
        if (documentError) {
          throw documentError;
        }
        
        // Insert document items
        const documentItems = rows
          .filter(row => row.desc && row.qty && row.price) // Only save valid rows
          .map(row => ({
            document_id: documentData.id,
            description: row.desc,
            quantity: Number(row.qty),
            unit_price: Number(row.price),
            tax: row.tax ? Number(row.tax) : null
          }));
        
        if (documentItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('document_items')
            .insert(documentItems);
          
          if (itemsError) {
            throw itemsError;
          }
        }
        
        toast.success(`Your ${documentType} has been ${status === 'draft' ? 'saved' : 'sent'}`);
        navigate('/');
      } catch (error) {
        console.error(`Error saving ${documentType}:`, error);
        toast.error(`Failed to save ${documentType}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demo mode without saving to database
      toast.success(`Your ${documentType} has been ${status === 'draft' ? 'saved' : 'sent'}`);
      navigate('/');
    }
  };

  return {
    activeTab,
    setActiveTab,
    documentType,
    details,
    isLoading,
    userSettings,
    fields,
    rows,
    handleTypeChange,
    handleDetailsChange,
    handleSave,
    setFields,
    setRows,
    handleClientSelect
  };
};
