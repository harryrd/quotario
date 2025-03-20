
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
}

const PaymentMethods: React.FC = () => {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([
    {
      id: '1',
      accountName: 'Acme Business Account',
      accountNumber: '1234567890',
      bankName: 'First National Bank',
      swiftCode: 'FNBUS123'
    }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newAccount, setNewAccount] = useState<Omit<PaymentAccount, 'id'>>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: ''
  });

  const handleAddAccount = () => {
    if (!newAccount.accountName || !newAccount.accountNumber) {
      toast.error('Account name and number are required');
      return;
    }
    
    const id = Math.random().toString(36).substr(2, 9);
    setAccounts([...accounts, { ...newAccount, id }]);
    setNewAccount({ accountName: '', accountNumber: '', bankName: '', swiftCode: '' });
    setIsAdding(false);
    toast.success('Payment account added successfully');
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast.success('Payment account removed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="p-4 border rounded-md">
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
                onClick={() => handleDeleteAccount(account.id)}
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
        ))}
      </div>
      
      {isAdding ? (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 border rounded-md space-y-4"
        >
          <h3 className="font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Add New Payment Account
          </h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                value={newAccount.accountName}
                onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={newAccount.bankName}
                onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="swift-code">SWIFT Code (optional)</Label>
              <Input
                id="swift-code"
                value={newAccount.swiftCode}
                onChange={(e) => setNewAccount({...newAccount, swiftCode: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddAccount}>
                Save Account
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewAccount({ accountName: '', accountNumber: '', bankName: '', swiftCode: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Add Payment Account
        </Button>
      )}
    </motion.div>
  );
};

export default PaymentMethods;
