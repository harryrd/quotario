
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Building, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

const statusColors: Record<DocumentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  declined: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

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
  const typeIcon = type === 'invoice' ? 
    <FileText className="h-3 w-3 mr-1" /> : 
    <FileText className="h-3 w-3 mr-1" />;

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
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Badge 
                variant="outline" 
                className="text-[10px] px-1 py-0 h-4 uppercase tracking-wider font-medium mr-2 flex items-center"
              >
                {typeIcon}
                {type}
              </Badge>
              <Badge className={cn("text-[10px] px-1 py-0 h-4 rounded-full", statusColors[status])}>
                {status}
              </Badge>
            </div>
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
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
