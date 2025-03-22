
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

interface PaymentAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
}

const PaymentMethods: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAccount, setNewAccount] = useState<Omit<PaymentAccount, 'id'>>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: ''
  });

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
          const transformedAccounts = data.map(account => ({
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

  const handleAddAccount = async () => {
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
        id: data.id,
        accountName: data.account_name,
        accountNumber: data.account_number,
        bankName: data.bank_name,
        swiftCode: data.swift_code || ''
      };
      
      setAccounts([...accounts, newPaymentAccount]);
      setNewAccount({ accountName: '', accountNumber: '', bankName: '', swiftCode: '' });
      setIsAdding(false);
      toast.success('Payment account added successfully');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong while adding payment account');
    }
  };

  const handleDeleteAccount = async (id: string) => {
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
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">Loading payment accounts...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        {accounts.length === 0 && !isAdding ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No payment accounts added yet</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAdding(true)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Add Your First Payment Account
            </Button>
          </div>
        ) : (
          accounts.map((account) => (
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
          ))
        )}
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
      ) : accounts.length > 0 && (
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
