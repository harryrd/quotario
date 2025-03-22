
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePaymentAccounts } from '@/hooks/usePaymentAccounts';
import PaymentAccountList from './payment/PaymentAccountList';
import PaymentAccountForm from './payment/PaymentAccountForm';
import { PaymentAccount } from '@/types/payment';

const PaymentMethods: React.FC = () => {
  const { accounts, isLoading, addAccount, deleteAccount } = usePaymentAccounts();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAccount = async (newAccount: Omit<PaymentAccount, 'id'>) => {
    try {
      await addAccount(newAccount);
      setIsAdding(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Failed to add account:', error);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {!isAdding ? (
        <PaymentAccountList 
          accounts={accounts}
          onDelete={deleteAccount}
          onAddClick={handleAddClick}
          isLoading={isLoading}
          showAddButton={accounts.length > 0}
        />
      ) : (
        <PaymentAccountForm 
          onAddAccount={handleAddAccount}
          onCancel={handleCancelAdd}
        />
      )}
    </motion.div>
  );
};

export default PaymentMethods;
