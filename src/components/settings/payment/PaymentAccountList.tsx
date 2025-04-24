
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentAccount } from '@/schemas/payment';
import PaymentAccountItem from './PaymentAccountItem';

interface PaymentAccountListProps {
  accounts: PaymentAccount[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PaymentAccountList: React.FC<PaymentAccountListProps> = ({ accounts, isLoading = false, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">Loading payment accounts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Payment Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-muted-foreground">
              You have not added any payment accounts yet.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="link" disabled>
            Add Payment Account
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <PaymentAccountItem
          key={account.id}
          account={account}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PaymentAccountList;
