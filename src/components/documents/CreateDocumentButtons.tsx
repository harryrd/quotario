
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CreateDocumentButtonsProps {
  onCreateDocument: (type: 'quotation' | 'invoice') => void;
}

const CreateDocumentButtons: React.FC<CreateDocumentButtonsProps> = ({ onCreateDocument }) => {
  return (
    <motion.div 
      className="fixed bottom-4 left-0 right-0 flex justify-center gap-3 px-3"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Button 
        className="flex-1 glass-card shadow-sm"
        onClick={() => onCreateDocument('quotation')}
      >
        New Quotation
      </Button>
      <Button 
        className="flex-1 glass-card shadow-sm"
        onClick={() => onCreateDocument('invoice')}
      >
        New Invoice
      </Button>
    </motion.div>
  );
};

export default CreateDocumentButtons;
