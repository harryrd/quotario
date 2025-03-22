
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DocumentSettings } from './DocumentSettings';
import { FormatSettings } from './FormatSettings';
import { AppearanceSettings } from './AppearanceSettings';

export type UserSettings = {
  currency: string;
  quotationPrefix: string;
  quotationStartNumber: string;
  invoicePrefix: string;
  invoiceStartNumber: string;
  dateFormat: string;
  language: string;
  fontSize: string;
}

const defaultSettings: UserSettings = {
  currency: 'USD',
  quotationPrefix: 'QUO-',
  quotationStartNumber: '1001',
  invoicePrefix: 'INV-',
  invoiceStartNumber: '1001',
  dateFormat: 'MM/DD/YYYY',
  language: 'English',
  fontSize: 'M'
};

export const getFontSizeValue = (size: string) => {
  switch (size) {
    case 'XS': return '14px';
    case 'S': return '15px';
    case 'M': return '16px';
    case 'L': return '18px';
    case 'XL': return '20px';
    default: return '16px';
  }
};

const GeneralSettings = () => {
  const { setFontSize } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({...defaultSettings});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
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
            fontSize: data.font_size
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
  }, [user, setFontSize]);

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    try {
      setSaving(true);

      // Transform settings to database column format
      const dbSettings = {
        user_id: user.id,
        currency: settings.currency,
        quotation_prefix: settings.quotationPrefix,
        quotation_start_number: settings.quotationStartNumber,
        invoice_prefix: settings.invoicePrefix,
        invoice_start_number: settings.invoiceStartNumber,
        date_format: settings.dateFormat,
        language: settings.language,
        font_size: settings.fontSize
      };

      const { data, error } = await supabase
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

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure general settings for your documents
        </p>
      </div>

      <Tabs defaultValue="document" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="document" className="space-y-5">
          <DocumentSettings 
            settings={settings} 
            onSettingChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="format" className="space-y-5">
          <FormatSettings 
            settings={settings} 
            onSettingChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-5">
          <AppearanceSettings 
            settings={settings} 
            onSettingChange={handleChange} 
          />
        </TabsContent>
      </Tabs>

      <Button 
        onClick={handleSave} 
        className="mt-4" 
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default GeneralSettings;
