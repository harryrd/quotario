
import React from 'react';
import { Save, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface DocumentActionsProps {
  onSave: (status: 'draft' | 'sent') => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ onSave }) => {
  return (
    <motion.div 
      className="fixed bottom-4 left-0 right-0 flex justify-center gap-3 px-3"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Button 
        variant="outline"
        className="flex-1 py-1 text-xs h-8"
        onClick={() => onSave('draft')}
      >
        <Save className="h-3 w-3 mr-1" />
        Save as Draft
      </Button>
      <Button 
        className="flex-1 py-1 text-xs h-8"
        onClick={() => onSave('sent')}
      >
        <Send className="h-3 w-3 mr-1" />
        Send Document
      </Button>
    </motion.div>
  );
};

export default DocumentActions;
