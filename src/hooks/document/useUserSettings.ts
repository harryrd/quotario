
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSettings {
  currency: string;
  quotationPrefix: string;
  quotationStartNumber: string;
  invoicePrefix: string;
  invoiceStartNumber: string;
  documentTemplates?: {
    quotation?: {
      fields: any[];
      pdfTemplate?: string;
    };
    invoice?: {
      fields: any[];
      pdfTemplate?: string;
    };
  };
}

export const useUserSettings = (userId: string | undefined) => {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    currency: 'USD',
    quotationPrefix: 'QUO-',
    quotationStartNumber: '1001',
    invoicePrefix: 'INV-',
    invoiceStartNumber: '1001'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error('Error fetching user settings:', settingsError);
          setLoading(false);
          return;
        }
        
        // Fetch document templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('document_templates')
          .select('*')
          .eq('user_id', userId);
        
        if (templatesError) {
          console.error('Error fetching document templates:', templatesError);
        }
        
        // Initialize templates object
        const templates = {
          quotation: null,
          invoice: null
        };
        
        // Process templates data
        if (templatesData && templatesData.length > 0) {
          templatesData.forEach(template => {
            if (template.type === 'quotation' || template.type === 'invoice') {
              templates[template.type] = template;
            }
          });
        }
        
        // Set user settings with templates
        setUserSettings({
          currency: settingsData?.currency || 'USD',
          quotationPrefix: settingsData?.quotation_prefix || 'QUO-',
          quotationStartNumber: settingsData?.quotation_start_number || '1001',
          invoicePrefix: settingsData?.invoice_prefix || 'INV-',
          invoiceStartNumber: settingsData?.invoice_start_number || '1001',
          documentTemplates: {
            quotation: templates.quotation ? {
              fields: templates.quotation.fields,
              pdfTemplate: templates.quotation.pdf_template
            } : undefined,
            invoice: templates.invoice ? {
              fields: templates.invoice.fields,
              pdfTemplate: templates.invoice.pdf_template
            } : undefined
          }
        });
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserSettings();
  }, [userId]);

  return { ...userSettings, loading };
};
