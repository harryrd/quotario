
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share, Printer, Edit, FileText, Menu, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const ViewDocuments: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [documentType, setDocumentType] = useState<'quotation' | 'invoice'>('quotation');
  
  const handlePreviewPDF = () => {
    toast.success('Preparing PDF preview...');
    // In a real app, this would generate and display a PDF
  };
  
  const handleConvertToInvoice = () => {
    toast.success('Converting quotation to invoice...');
    // In a real app, this would actually convert the document and redirect
    setDocumentType('invoice');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Document Details" 
        showBack
        actions={
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        }
      />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="p-8 bg-white rounded-lg shadow-sm border">
            <h1 className="text-2xl font-semibold mb-2">Website Development</h1>
            <p className="text-muted-foreground mb-6">Quotation for Acme Corp</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-medium mb-1">From:</h3>
                <p>Your Company Name</p>
                <p>123 Business Street</p>
                <p>City, State 12345</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">To:</h3>
                <p>Acme Corp</p>
                <p>456 Client Avenue</p>
                <p>Client City, State 67890</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
              <div>
                <h3 className="font-medium mb-1">Document Number:</h3>
                <p>QUO-2023-001</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Date:</h3>
                <p>October 15, 2023</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Valid Until:</h3>
                <p>November 15, 2023</p>
              </div>
            </div>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-right">Quantity</th>
                    <th className="py-2 px-4 text-right">Unit Price</th>
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Website Design & Mockups</td>
                    <td className="py-2 px-4 text-right">1</td>
                    <td className="py-2 px-4 text-right">$800.00</td>
                    <td className="py-2 px-4 text-right">$800.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Frontend Development</td>
                    <td className="py-2 px-4 text-right">1</td>
                    <td className="py-2 px-4 text-right">$1,200.00</td>
                    <td className="py-2 px-4 text-right">$1,200.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">CMS Integration</td>
                    <td className="py-2 px-4 text-right">1</td>
                    <td className="py-2 px-4 text-right">$500.00</td>
                    <td className="py-2 px-4 text-right">$500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>$2,500.00</span>
                </div>
                <div className="flex justify-between py-2 border-t border-t-gray-200">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">$2,500.00</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Notes:</h3>
              <p className="text-muted-foreground">This quotation is valid for 30 days from the date of issue. Payment terms: 50% upfront, 50% upon completion.</p>
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
                
                {documentType === 'quotation' && (
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
