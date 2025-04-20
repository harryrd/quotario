
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share, Printer, FilePlus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentActionsProps {
  documentId: string;
  documentType: 'quotation' | 'invoice';
  onPreviewPDF: () => void;
  onConvertToInvoice: () => Promise<void>;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  documentId,
  documentType,
  onPreviewPDF,
  onConvertToInvoice
}) => {
  // Handlers for new submenu items
  const markAsSent = () => {
    toast.success('Marked document as sent');
  };
  
  const markAsPaid = () => {
    toast.success('Marked document as fully paid');
  };

  const addPayment = () => {
    toast.success('Opening add payment dialog...');
  };

  const viewPaymentHistory = () => {
    toast.success('Showing payment history...');
  };

  return (
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
            onClick={onPreviewPDF}
          >
            <FilePlus className="h-4 w-4 mr-2" />
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
              <DropdownMenuItem onClick={markAsSent}>
                Mark as Sent
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={markAsPaid}>
                Mark as fully paid
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => toast.success('Downloading document...')}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => toast.success('Printing document...')}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>

              {/* Only for invoices, show payment related options */}
              {documentType === 'invoice' && (
                <>
                  <DropdownMenuItem onClick={addPayment}>
                    Add Payment
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={viewPaymentHistory}>
                    View Payment History
                  </DropdownMenuItem>
                </>
              )}

              {documentType === 'quotation' && (
                <DropdownMenuItem onClick={onConvertToInvoice}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Convert to Invoice
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentActions;

