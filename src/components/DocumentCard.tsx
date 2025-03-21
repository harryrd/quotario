
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
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
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn("w-full", className)}
    >
      <Card 
        className="w-full overflow-hidden shadow-sm border-border/50 hover:shadow-md smooth-transition"
        onClick={onClick}
      >
        <CardHeader className="p-2 pb-0 flex flex-row items-start justify-between">
          <div>
            <Badge 
              variant="outline" 
              className="mb-1 uppercase text-xs tracking-wider font-medium"
            >
              {type}
            </Badge>
            <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{clientName}</p>
          </div>
          <Badge className={cn("rounded-full text-xs font-medium py-0 h-5", statusColors[status])}>
            {status}
          </Badge>
        </CardHeader>
        <CardContent className="p-2 pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </CardContent>
        <CardFooter className="p-2 pt-0 flex justify-between items-center">
          <p className="font-medium text-sm">
            ${amount.toFixed(2)}
          </p>
          <Button variant="ghost" size="icon" className="rounded-full h-6 w-6">
            <ArrowRight className="h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
