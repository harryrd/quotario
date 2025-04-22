
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useAuth } from '@/components/AuthContext';
import { DocumentSettings } from './DocumentSettings';
import { FormatSettings } from './FormatSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { SettingsLoadingState } from './SettingsLoadingState';
import { useGeneralSettings } from '@/hooks/useGeneralSettings';

export type UserSettings = {
  currency: string;
  quotationPrefix: string;
  quotationStartNumber: string;
  invoicePrefix: string;
  invoiceStartNumber: string;
  dateFormat: string;
  language: string;
  fontSize: string;
  themeMode?: string;
}

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
  const { user } = useAuth();
  const { 
    settings, 
    loading, 
    saving, 
    handleChange, 
    handleSave 
  } = useGeneralSettings(user?.id);

  if (loading) {
    return <SettingsLoadingState />;
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
