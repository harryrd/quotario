
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';
import { PaymentAccount, PaymentAccountFormData } from '@/types/payment';

// Define the database row type to match the actual table structure
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

  // Fetch payment accounts from Supabase
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
          // Transform data to match our interface
          const transformedAccounts = (data as PaymentAccountRow[]).map(account => ({
            id: account.id,
            accountName: account.account_name,
            accountNumber: account.account_number,
            bankName: account.bank_name,
            swiftCode: account.swift_code || ''
          }));
          
          setAccounts(transformedAccounts);
        } else {
          // If no accounts found, set an empty array
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
      // Save to Supabase
      const { data, error } = await supabase
        .from('payment_accounts')
        .insert({
          user_id: user.id,
          account_name: newAccount.accountName,
          account_number: newAccount.accountNumber,
          bank_name: newAccount.bankName,
          swift_code: newAccount.swiftCode
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error adding payment account:', error);
        toast.error('Failed to add payment account');
        return;
      }
      
      // Add to local state
      const newPaymentAccount: PaymentAccount = {
        id: (data as PaymentAccountRow).id,
        accountName: (data as PaymentAccountRow).account_name,
        accountNumber: (data as PaymentAccountRow).account_number,
        bankName: (data as PaymentAccountRow).bank_name,
        swiftCode: (data as PaymentAccountRow).swift_code || ''
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
      // Update in Supabase
      const { error } = await supabase
        .from('payment_accounts')
        .update({
          account_name: updatedAccount.accountName,
          account_number: updatedAccount.accountNumber,
          bank_name: updatedAccount.bankName,
          swift_code: updatedAccount.swiftCode
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error updating payment account:', error);
        toast.error('Failed to update payment account');
        return;
      }
      
      // Update local state
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
