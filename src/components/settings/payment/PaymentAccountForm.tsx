
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { PaymentAccount, PaymentAccountFormData } from '@/types/payment';

interface PaymentAccountFormProps {
  onSubmit: (account: PaymentAccountFormData) => Promise<void>;
  onCancel: () => void;
  account?: PaymentAccount;
  isEditing?: boolean;
}

const PaymentAccountForm: React.FC<PaymentAccountFormProps> = ({ 
  onSubmit, 
  onCancel, 
  account,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<PaymentAccountFormData>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: ''
  });

  // Load existing account data if editing
  useEffect(() => {
    if (account && isEditing) {
      setFormData({
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bankName: account.bankName,
        swiftCode: account.swiftCode
      });
    }
  }, [account, isEditing]);

  const handleSubmit = async () => {
    await onSubmit(formData);
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
        {isEditing ? 'Edit Payment Account' : 'Add New Payment Account'}
      </h3>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="account-name">Account Name</Label>
          <Input
            id="account-name"
            value={formData.accountName}
            onChange={(e) => setFormData({...formData, accountName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bank-name">Bank Name</Label>
          <Input
            id="bank-name"
            value={formData.bankName}
            onChange={(e) => setFormData({...formData, bankName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <Input
            id="account-number"
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="swift-code">SWIFT Code (optional)</Label>
          <Input
            id="swift-code"
            value={formData.swiftCode}
            onChange={(e) => setFormData({...formData, swiftCode: e.target.value})}
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Save Account'}
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
