
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type DocumentType = 'quotation' | 'invoice';
export type DocumentStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'paid';

export interface DocumentCardProps {
  id: string;
  type: DocumentType;
  title: string;
  clientName: string;
  date: string;
  amount: number;
  status: DocumentStatus;
  onClick?: () => void;
  className?: string;
}

const statusColors: Record<DocumentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  declined: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  type,
  title,
  clientName,
  date,
  amount,
  status,
  onClick,
  className,
}) => {
  const typeIcon = type === 'invoice' ? 
    <FileText className="h-3 w-3 mr-1" /> : 
    <FileText className="h-3 w-3 mr-1" />;

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn("w-full", className)}
    >
      <Card 
        className="w-full overflow-hidden border-border/50 hover:shadow-sm smooth-transition p-3"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1">
            <div className="flex items-center mb-1">
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
            <p className="text-xs text-muted-foreground line-clamp-1">{clientName}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-xs">
              ${amount.toFixed(2)}
            </p>
            <div className="flex items-center justify-end text-[10px] text-muted-foreground mt-1">
              <Calendar className="h-2.5 w-2.5 mr-1" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
