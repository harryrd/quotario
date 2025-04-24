import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentAccountForm from './payment/PaymentAccountForm';
import { usePaymentAccounts } from '@/hooks/usePaymentAccounts';
import { PaymentAccount, PaymentAccountFormData } from '@/schemas/payment';
import PaymentAccountList from './payment/PaymentAccountList';

const PaymentMethods = () => {
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<PaymentAccount | null>(null);
  const { accounts, isLoading, addAccount, editAccount, deleteAccount } = usePaymentAccounts();

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setOpen(true);
  };

  const handleEditAccount = (account: PaymentAccount) => {
    setSelectedAccount(account);
    setOpen(true);
  };

  const handleSaveAccount = async (accountData: PaymentAccountFormData) => {
    if (selectedAccount) {
      // Edit existing account
      await editAccount(selectedAccount.id, accountData);
    } else {
      // Add new account
      await addAccount(accountData);
    }
    setOpen(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(id);
  };

  return (
    <div>
      <div className="md:flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Payment Methods</h2>
        <Button size="sm" onClick={handleAddAccount}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Account
        </Button>
      </div>

      <PaymentAccountList
        accounts={accounts}
        isLoading={isLoading}
        onEdit={handleEditAccount}
        onDelete={handleDeleteAccount}
      />

      <PaymentAccountForm
        open={open}
        setOpen={setOpen}
        onSave={handleSaveAccount}
        account={selectedAccount}
      />
    </div>
  );
};

export default PaymentMethods;
