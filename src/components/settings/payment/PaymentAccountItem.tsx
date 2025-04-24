import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentAccount } from '@/schemas/payment';

interface PaymentAccountItemProps {
  account: PaymentAccount;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PaymentAccountItem: React.FC<PaymentAccountItemProps> = ({ account, onEdit, onDelete }) => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <h3 className="text-sm font-medium">{account.accountName}</h3>
          <p className="text-xs text-muted-foreground">
            {account.type === 'bank' ? `Bank: ${account.bankName}` : 'PayPal Account'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(account.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(account.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentAccountItem;
