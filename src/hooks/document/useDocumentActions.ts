
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Document } from '@/schemas/document-details';

export const useDocumentActions = (document: Document | null, userId: string | undefined) => {
  const handleConvertToInvoice = async () => {
    if (!document || !userId) return;
    
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
      
      toast.success('Converted quotation to invoice');
      return { ...document, type: 'invoice' };
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
      return null;
    }
  };

  const handlePreviewPDF = () => {
    toast.success('Preparing PDF preview...');
    // In a real app, this would generate and display a PDF
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return {
    handleConvertToInvoice,
    handlePreviewPDF,
    formatDate
  };
};
