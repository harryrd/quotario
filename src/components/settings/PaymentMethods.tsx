import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePaymentAccounts } from '@/hooks/usePaymentAccounts';
import PaymentAccountList from './payment/PaymentAccountList';
import PaymentAccountForm from './payment/PaymentAccountForm';
import { PaymentAccount, PaymentAccountFormData } from '@/schemas/payment';

const PaymentMethods: React.FC = () => {
  const { accounts, isLoading, addAccount, editAccount, deleteAccount } = usePaymentAccounts();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<PaymentAccount | undefined>(undefined);

  const handleAddAccount = async (newAccount: PaymentAccountFormData) => {
    try {
      await addAccount(newAccount);
      setIsAdding(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Failed to add account:', error);
    }
  };

  const handleEditAccount = async (updatedAccount: PaymentAccountFormData) => {
    if (!currentAccount) return;
    
    try {
      await editAccount(currentAccount.id, updatedAccount);
      setIsEditing(false);
      setCurrentAccount(undefined);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Failed to update account:', error);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentAccount(undefined);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleEditClick = (account: PaymentAccount) => {
    setCurrentAccount(account);
    setIsEditing(true);
  };

  // Show form if in adding or editing mode
  const showForm = isAdding || isEditing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {!showForm ? (
        <PaymentAccountList 
          accounts={accounts}
          onDelete={deleteAccount}
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          isLoading={isLoading}
          showAddButton={accounts.length > 0}
        />
      ) : isAdding ? (
        <PaymentAccountForm 
          onSubmit={handleAddAccount}
          onCancel={handleCancelAdd}
          isEditing={false}
        />
      ) : (
        <PaymentAccountForm 
          onSubmit={handleEditAccount}
          onCancel={handleCancelEdit}
          account={currentAccount}
          isEditing={true}
        />
      )}
    </motion.div>
  );
};

export default PaymentMethods;
