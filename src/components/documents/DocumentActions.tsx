
import React from 'react';
import { Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentActionsProps {
  onSave: (status: 'draft' | 'sent') => void;
  isLoading?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ onSave, isLoading = false }) => {
  return (
    <motion.div 
      className="fixed bottom-4 left-0 right-0 flex justify-center gap-3 px-3 z-10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline"
              className="flex-1 py-1 text-xs h-8"
              onClick={() => onSave('draft')}
              disabled={isLoading}
            >
              <Save className="h-3 w-3 mr-1" />
              {isLoading ? 'Saving...' : 'Save as Draft'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your document as a draft</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className="flex-1 py-1 text-xs h-8"
              onClick={() => onSave('sent')}
              disabled={isLoading}
            >
              <Save className="h-3 w-3 mr-1" />
              {isLoading ? 'Saving...' : 'Save Document'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save and mark as sent</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default DocumentActions;
