import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Edit, Trash2, CreditCard } from 'lucide-react';
import { PaymentAccount } from '@/schemas/payment';

interface PaymentAccountItemProps {
  account: PaymentAccount;
  onDelete: (id: string) => void;
  onEdit: (account: PaymentAccount) => void;
}

const PaymentAccountItem: React.FC<PaymentAccountItemProps> = ({ account, onDelete, onEdit }) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {account.type === 'paypal' ? (
              <CreditCard className="h-4 w-4 text-primary" />
            ) : (
              <Wallet className="h-4 w-4 text-primary" />
            )}
          </div>
          <h3 className="font-medium">{account.accountName}</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(account)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive/90"
            onClick={() => onDelete(account.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-2 text-sm">
        {account.type === 'bank' && (
          <>
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
          </>
        )}
        {account.type === 'paypal' && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">PayPal Email/ID:</span>
            <span>{account.accountNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentAccountItem;
