import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentAccount, PaymentAccountFormData } from '@/schemas/payment';

interface PaymentAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: PaymentAccountFormData, id?: string) => void;
  account?: PaymentAccount;
}

const PaymentAccountForm: React.FC<PaymentAccountFormProps> = ({ isOpen, onClose, onSave, account }) => {
  const [formData, setFormData] = useState<PaymentAccountFormData>({
    type: 'bank',
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: '',
  });

  useEffect(() => {
    if (account) {
      setFormData({
        type: account.type,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bankName: account.bankName,
        swiftCode: account.swiftCode,
      });
    } else {
      // Reset form when creating a new account
      setFormData({
        type: 'bank',
        accountName: '',
        accountNumber: '',
        bankName: '',
        swiftCode: '',
      });
    }
  }, [account]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(formData, account?.id);
    onClose();
  };

  const handleTabChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as 'bank' | 'paypal',
      bankName: '',
      swiftCode: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Edit Payment Account' : 'Add Payment Account'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={formData.type} className="space-y-4" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-2">
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="accountName" className="text-xs">
                  Account Name
                </Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="accountNumber" className="text-xs">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="bankName" className="text-xs">
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Bank of America"
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="swiftCode" className="text-xs">
                  SWIFT Code
                </Label>
                <Input
                  id="swiftCode"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleInputChange}
                  placeholder="BOFAUS6S"
                  className="h-9"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-2">
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="accountName" className="text-xs">
                  Account Name
                </Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="accountNumber" className="text-xs">
                  PayPal Email
                </Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  className="h-9"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentAccountForm;
