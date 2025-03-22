
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Monitor, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type UserSettings = {
  currency: string;
  quotationPrefix: string;
  quotationStartNumber: string;
  invoicePrefix: string;
  invoiceStartNumber: string;
  dateFormat: string;
  language: string;
  fontSize: string;
  colorPalette: string;
  theme: "light" | "dark" | "system";
}

const defaultSettings: UserSettings = {
  currency: 'USD',
  quotationPrefix: 'QUO-',
  quotationStartNumber: '1001',
  invoicePrefix: 'INV-',
  invoiceStartNumber: '1001',
  dateFormat: 'MM/DD/YYYY',
  language: 'English',
  fontSize: 'M',
  colorPalette: 'default',
  theme: 'system'
};

const ColorPalette = ({ color, name, isSelected, onClick }: { color: string, name: string, isSelected: boolean, onClick: () => void }) => (
  <div 
    className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer rounded-sm"
    onClick={onClick}
  >
    <div className={`relative h-5 w-5 rounded-full ${color}`}></div>
    <span>{name}</span>
    {isSelected && <Check className="h-4 w-4 ml-auto" />}
  </div>
);

const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({...defaultSettings, theme});
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
            fontSize: data.font_size,
            colorPalette: data.color_palette,
            theme: data.theme as "light" | "dark" | "system"
          };
          
          setSettings(userSettings);
          
          // Apply settings to the UI
          document.documentElement.style.fontSize = getFontSizeValue(userSettings.fontSize);
          applyColorPalette(userSettings.colorPalette);
          setTheme(userSettings.theme);
        }
      } catch (error) {
        console.error('Error in fetchUserSettings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [user, setTheme]);

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });

    // Apply color palette and theme changes immediately for preview
    if (field === 'colorPalette') {
      applyColorPalette(value);
    }
    
    if (field === 'theme') {
      setTheme(value as "light" | "dark" | "system");
    }
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
        font_size: settings.fontSize,
        color_palette: settings.colorPalette,
        theme: settings.theme
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

      // Apply font size and color palette globally
      document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
      applyColorPalette(settings.colorPalette);
      setTheme(settings.theme);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };
  
  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'XS': return '14px';
      case 'S': return '15px';
      case 'M': return '16px';
      case 'L': return '18px';
      case 'XL': return '20px';
      default: return '16px';
    }
  };

  const applyColorPalette = (palette: string) => {
    const root = document.documentElement;
    
    // Reset to defaults
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-foreground');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--accent');
    
    switch (palette) {
      case 'blue':
        root.style.setProperty('--primary', 'hsl(221, 83%, 53%)');
        root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--secondary', 'hsl(214, 32%, 91%)');
        root.style.setProperty('--accent', 'hsl(217, 91%, 60%)');
        break;
      case 'purple':
        root.style.setProperty('--primary', 'hsl(271, 91%, 65%)');
        root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--secondary', 'hsl(270, 50%, 96%)');
        root.style.setProperty('--accent', 'hsl(280, 67%, 69%)');
        break;
      case 'green':
        root.style.setProperty('--primary', 'hsl(162, 47%, 50%)');
        root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
        root.style.setProperty('--secondary', 'hsl(168, 55%, 94%)');
        root.style.setProperty('--accent', 'hsl(162, 73%, 46%)');
        break;
      default:
        // Default (monochrome) - no need to set anything as we've already reset
        break;
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
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={settings.currency} 
              onValueChange={(value) => handleChange('currency', value)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
                <SelectItem value="IDR">IDR (Rp)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotationPrefix">Quotation Number Prefix</Label>
              <Input
                id="quotationPrefix"
                value={settings.quotationPrefix}
                onChange={(e) => handleChange('quotationPrefix', e.target.value)}
                placeholder="QUO-"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotationStartNumber">Starting Number</Label>
              <Input
                id="quotationStartNumber"
                value={settings.quotationStartNumber}
                onChange={(e) => handleChange('quotationStartNumber', e.target.value)}
                placeholder="1001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
              <Input
                id="invoicePrefix"
                value={settings.invoicePrefix}
                onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                placeholder="INV-"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceStartNumber">Starting Number</Label>
              <Input
                id="invoiceStartNumber"
                value={settings.invoiceStartNumber}
                onChange={(e) => handleChange('invoiceStartNumber', e.target.value)}
                placeholder="1001"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="format" className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select 
              value={settings.dateFormat} 
              onValueChange={(value) => handleChange('dateFormat', value)}
            >
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select 
              value={settings.language} 
              onValueChange={(value) => handleChange('language', value)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Indonesian">Bahasa Indonesia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select 
              value={settings.fontSize} 
              onValueChange={(value) => handleChange('fontSize', value)}
            >
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XS">Extra Small</SelectItem>
                <SelectItem value="S">Small</SelectItem>
                <SelectItem value="M">Medium</SelectItem>
                <SelectItem value="L">Large</SelectItem>
                <SelectItem value="XL">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="themeSelector">Theme Mode</Label>
            <ToggleGroup 
              type="single" 
              value={settings.theme} 
              onValueChange={(value) => value && handleChange('theme', value)} 
              className="justify-start"
            >
              <ToggleGroupItem value="light" aria-label="Light Mode">
                <Sun className="h-4 w-4 mr-2" />
                Light
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark Mode">
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </ToggleGroupItem>
              <ToggleGroupItem value="system" aria-label="System Theme">
                <Monitor className="h-4 w-4 mr-2" />
                System
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label>Color Palette</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-2 ${
                      settings.colorPalette === 'default' ? 'bg-gradient-to-br from-gray-700 to-gray-900' :
                      settings.colorPalette === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                      settings.colorPalette === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 
                      'bg-gradient-to-br from-emerald-500 to-emerald-700'
                    }`}></div>
                    {settings.colorPalette === 'default' ? 'Monochrome' : 
                     settings.colorPalette === 'blue' ? 'Blue' :
                     settings.colorPalette === 'purple' ? 'Purple' : 'Green'}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <ColorPalette 
                  color="bg-gradient-to-br from-gray-700 to-gray-900" 
                  name="Monochrome"
                  isSelected={settings.colorPalette === 'default'} 
                  onClick={() => handleChange('colorPalette', 'default')} 
                />
                <ColorPalette 
                  color="bg-gradient-to-br from-blue-500 to-blue-700" 
                  name="Blue"
                  isSelected={settings.colorPalette === 'blue'} 
                  onClick={() => handleChange('colorPalette', 'blue')} 
                />
                <ColorPalette 
                  color="bg-gradient-to-br from-purple-500 to-purple-700" 
                  name="Purple"
                  isSelected={settings.colorPalette === 'purple'} 
                  onClick={() => handleChange('colorPalette', 'purple')} 
                />
                <ColorPalette 
                  color="bg-gradient-to-br from-emerald-500 to-emerald-700" 
                  name="Green"
                  isSelected={settings.colorPalette === 'green'} 
                  onClick={() => handleChange('colorPalette', 'green')} 
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
