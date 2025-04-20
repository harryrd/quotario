import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';
import { PaymentAccount, PaymentAccountFormData } from '@/types/payment';

type PaymentAccountRow = {
  id: string;
  user_id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  swift_code: string | null;
  created_at: string;
  updated_at: string;
};

export const usePaymentAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentAccounts = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('payment_accounts')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching payment accounts:', error);
          toast.error('Failed to load payment accounts');
          return;
        }
        
        if (data && data.length > 0) {
          const transformedAccounts = (data as PaymentAccountRow[]).map(account => ({
            id: account.id,
            accountName: account.account_name,
            accountNumber: account.account_number,
            bankName: account.bank_name,
            swiftCode: account.swift_code || ''
          }));
          
          setAccounts(transformedAccounts);
        } else {
          setAccounts([]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('Something went wrong while loading payment accounts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentAccounts();
  }, [user]);

  const addAccount = async (newAccount: PaymentAccountFormData) => {
    if (!user) {
      toast.error('You must be logged in to add payment accounts');
      return;
    }
    
    if (!newAccount.accountName || !newAccount.accountNumber) {
      toast.error('Account name and number are required');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('payment_accounts')
        .insert({
          user_id: user.id,
          account_name: newAccount.accountName,
          account_number: newAccount.accountNumber,
          bank_name: newAccount.bankName,
          swift_code: newAccount.swiftCode,
          type: newAccount.type || 'bank'
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error adding payment account:', error);
        toast.error('Failed to add payment account');
        return;
      }
      
      const newPaymentAccount: PaymentAccount = {
        id: (data as any).id,
        accountName: (data as any).account_name,
        accountNumber: (data as any).account_number,
        bankName: (data as any).bank_name,
        swiftCode: (data as any).swift_code || '',
        type: (data as any).type || 'bank'
      };
      
      setAccounts([...accounts, newPaymentAccount]);
      toast.success('Payment account added successfully');
      return newPaymentAccount;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong while adding payment account');
      throw error;
    }
  };

  const editAccount = async (id: string, updatedAccount: PaymentAccountFormData) => {
    if (!user) {
      toast.error('You must be logged in to edit payment accounts');
      return;
    }
    
    if (!updatedAccount.accountName || !updatedAccount.accountNumber) {
      toast.error('Account name and number are required');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('payment_accounts')
        .update({
          account_name: updatedAccount.accountName,
          account_number: updatedAccount.accountNumber,
          bank_name: updatedAccount.bankName,
          swift_code: updatedAccount.swiftCode,
          type: updatedAccount.type || 'bank'
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error updating payment account:', error);
        toast.error('Failed to update payment account');
        return;
      }
      
      setAccounts(accounts.map(account => 
        account.id === id 
          ? { ...account, ...updatedAccount }
          : account
      ));
      
      toast.success('Payment account updated successfully');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong while updating payment account');
      throw error;
    }
  };

  const deleteAccount = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('payment_accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error deleting payment account:', error);
        toast.error('Failed to remove payment account');
        return;
      }
      
      setAccounts(accounts.filter(account => account.id !== id));
      toast.success('Payment account removed');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong while removing payment account');
      throw error;
    }
  };

  return {
    accounts,
    isLoading,
    addAccount,
    editAccount,
    deleteAccount
  };
};
