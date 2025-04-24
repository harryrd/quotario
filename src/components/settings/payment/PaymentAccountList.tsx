
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PaymentAccount } from '@/schemas/payment';
import PaymentAccountItem from './PaymentAccountItem';

interface PaymentAccountListProps {
  accounts: PaymentAccount[];
  onDelete: (id: string) => Promise<void>;
  onAddClick: () => void;
  onEditClick: (account: PaymentAccount) => void;
  isLoading: boolean;
  showAddButton: boolean;
}

const PaymentAccountList: React.FC<PaymentAccountListProps> = ({ 
  accounts, 
  onDelete, 
  onAddClick, 
  onEditClick,
  isLoading,
  showAddButton
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">Loading payment accounts...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No payment accounts added yet</p>
        <Button 
          variant="outline" 
          onClick={onAddClick}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Add Your First Payment Account
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        {accounts.map((account) => (
          <PaymentAccountItem 
            key={account.id} 
            account={account} 
            onDelete={onDelete}
            onEdit={onEditClick}
          />
        ))}
      </div>
      
      {showAddButton && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onAddClick}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Add Payment Account
        </Button>
      )}
    </motion.div>
  );
};

export default PaymentAccountList;
