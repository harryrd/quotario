
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type DocumentType = 'quotation' | 'invoice';
export type DocumentStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'paid';

export interface DocumentCardProps {
  id: string;
  type: DocumentType;
  title: string;
  clientName: string;
  clientCompany?: string;
  date: string;
  amount: number;
  status: DocumentStatus;
  onClick?: () => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  className?: string;
  currency?: string;
}

// Function to get currency symbol based on currency code
const getCurrencySymbol = (currencyCode: string = 'USD') => {
  switch (currencyCode) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'JPY': return '¥';
    case 'CAD': return 'C$';
    case 'IDR': return 'Rp';
    default: return currencyCode;
  }
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  type,
  title,
  clientName,
  clientCompany,
  date,
  amount,
  status,
  onClick,
  onDelete,
  className,
  currency = 'USD',
}) => {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn("w-full", className)}
    >
      <Card 
        className="w-full overflow-hidden border-border/50 hover:shadow-sm smooth-transition p-4"
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
            <div className="flex flex-col mt-1">
              <p className="text-xs text-muted-foreground line-clamp-1">
                {clientName}
              </p>
              {clientCompany && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Building className="h-2.5 w-2.5 mr-1" />
                  <span className="line-clamp-1">{clientCompany}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm">
              {currencySymbol}{amount.toFixed(2)}
            </p>
            <div className="flex items-center justify-end text-[10px] text-muted-foreground mt-1">
              <Calendar className="h-2.5 w-2.5 mr-1" />
              <span>{date}</span>
            </div>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 mt-2 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => onDelete(id, e)}
              >
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
