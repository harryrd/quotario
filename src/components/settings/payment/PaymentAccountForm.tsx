
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { PaymentAccount } from '@/types/payment';

interface PaymentAccountFormProps {
  onAddAccount: (account: Omit<PaymentAccount, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const PaymentAccountForm: React.FC<PaymentAccountFormProps> = ({ onAddAccount, onCancel }) => {
  const [newAccount, setNewAccount] = useState<Omit<PaymentAccount, 'id'>>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: ''
  });

  const handleSubmit = async () => {
    await onAddAccount(newAccount);
    // Reset form is handled by parent after successful submission
  };

  return (
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
          <Button onClick={handleSubmit}>
            Save Account
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentAccountForm;
