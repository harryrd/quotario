
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/components/ThemeProvider';
import { UserSettings, getFontSizeValue } from '@/components/settings/general';

export const useGeneralSettings = (userId: string | undefined) => {
  const { setFontSize } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({
    currency: 'USD',
    quotationPrefix: 'QUO-',
    quotationStartNumber: '1001',
    invoicePrefix: 'INV-',
    invoiceStartNumber: '1001',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    fontSize: 'M'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user settings on hook mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          toast.error('Failed to load settings');
          return;
        }

        if (data) {
          // Transform database column names to camelCase
          const userSettings = {
            currency: data.currency,
            quotationPrefix: data.quotation_prefix,
            quotationStartNumber: data.quotation_start_number,
            invoicePrefix: data.invoice_prefix,
            invoiceStartNumber: data.invoice_start_number,
            dateFormat: data.date_format,
            language: data.language,
            fontSize: data.font_size,
            themeMode: data.theme_mode
          };
          
          setSettings(userSettings);
          
          // Apply settings to the UI
          document.documentElement.style.fontSize = getFontSizeValue(userSettings.fontSize);
          setFontSize(userSettings.fontSize);
        }
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [userId, setFontSize]);

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('You must be logged in to save settings');
      return;
    }

    try {
      setSaving(true);

      // Transform settings to database column format
      const dbSettings = {
        user_id: userId,
        currency: settings.currency,
        quotation_prefix: settings.quotationPrefix,
        quotation_start_number: settings.quotationStartNumber,
        invoice_prefix: settings.invoicePrefix,
        invoice_start_number: settings.invoiceStartNumber,
        date_format: settings.dateFormat,
        language: settings.language,
        font_size: settings.fontSize,
        theme_mode: settings.themeMode
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert(dbSettings, { onConflict: 'user_id' })
        .select();

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
        return;
      }

      // Apply font size globally
      document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
      setFontSize(settings.fontSize);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    handleChange,
    handleSave
  };
};
