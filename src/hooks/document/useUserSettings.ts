
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSettings {
  currency: string;
  quotationPrefix: string;
  quotationStartNumber: string;
  invoicePrefix: string;
  invoiceStartNumber: string;
}

export const useUserSettings = (userId: string | undefined) => {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    currency: 'USD',
    quotationPrefix: 'QUO-',
    quotationStartNumber: '1001',
    invoicePrefix: 'INV-',
    invoiceStartNumber: '1001'
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching user settings:', error);
          return;
        }
        
        if (data) {
          setUserSettings({
            currency: data.currency || 'USD',
            quotationPrefix: data.quotation_prefix || 'QUO-',
            quotationStartNumber: data.quotation_start_number || '1001',
            invoicePrefix: data.invoice_prefix || 'INV-',
            invoiceStartNumber: data.invoice_start_number || '1001'
          });
        }
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
      }
    };
    
    fetchUserSettings();
  }, [userId]);

  return userSettings;
};
