
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { PaymentAccount } from '@/types/payment';

interface PaymentAccountItemProps {
  account: PaymentAccount;
  onDelete: (id: string) => void;
}

const PaymentAccountItem: React.FC<PaymentAccountItemProps> = ({ account, onDelete }) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium">{account.accountName}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-destructive hover:text-destructive/90"
          onClick={() => onDelete(account.id)}
        >
          Remove
        </Button>
      </div>
      
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bank:</span>
          <span>{account.bankName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Account Number:</span>
          <span>{account.accountNumber}</span>
        </div>
        {account.swiftCode && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">SWIFT Code:</span>
            <span>{account.swiftCode}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentAccountItem;
