
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Calendar } from 'lucide-react';
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
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  paid: 'bg-emerald-100 text-emerald-800',
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn("w-full", className)}
    >
      <Card 
        className="w-full overflow-hidden shadow-sm border-border/50 hover:shadow-md smooth-transition"
        onClick={onClick}
      >
        <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
          <div>
            <Badge 
              variant="outline" 
              className="mb-2 uppercase text-xs tracking-wider font-medium"
            >
              {type}
            </Badge>
            <h3 className="text-lg font-medium line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{clientName}</p>
          </div>
          <Badge className={cn("rounded-full text-xs font-medium", statusColors[status])}>
            {status}
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="font-medium text-lg">
            ${amount.toFixed(2)}
          </p>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
