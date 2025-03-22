
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
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ColorPalette = ({ color, isSelected, onClick }: { color: string, isSelected: boolean, onClick: () => void }) => (
  <div 
    className={`relative h-12 w-12 rounded-md cursor-pointer overflow-hidden border-2 ${isSelected ? 'border-primary' : 'border-transparent'}`}
    onClick={onClick}
  >
    <div className={`h-full w-full ${color}`} />
    {isSelected && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Check className="h-5 w-5 text-white drop-shadow-md" />
      </div>
    )}
  </div>
);

const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    currency: 'USD',
    quotationPrefix: 'QUO-',
    quotationStartNumber: '1001',
    invoicePrefix: 'INV-',
    invoiceStartNumber: '1001',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    fontSize: 'M',
    colorPalette: 'default',
  });

  const handleChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });

    // Apply color palette immediately
    if (field === 'colorPalette') {
      applyColorPalette(value);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    toast.success('Settings saved successfully');
    
    // Apply font size globally
    document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
    
    // Apply color palette
    applyColorPalette(settings.colorPalette);
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

  // Apply font size on initial render
  useEffect(() => {
    document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
  }, []);

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
            <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value as "light" | "dark" | "system")} className="justify-start">
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
            <RadioGroup 
              value={settings.colorPalette}
              onValueChange={(value) => handleChange('colorPalette', value)}
              className="flex flex-wrap gap-3 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" className="sr-only" />
                <Label htmlFor="default" className="flex items-center space-x-2 cursor-pointer">
                  <ColorPalette 
                    color="bg-gradient-to-br from-gray-700 to-gray-900" 
                    isSelected={settings.colorPalette === 'default'} 
                    onClick={() => handleChange('colorPalette', 'default')} 
                  />
                  <div>Monochrome</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blue" id="blue" className="sr-only" />
                <Label htmlFor="blue" className="flex items-center space-x-2 cursor-pointer">
                  <ColorPalette 
                    color="bg-gradient-to-br from-blue-500 to-blue-700" 
                    isSelected={settings.colorPalette === 'blue'} 
                    onClick={() => handleChange('colorPalette', 'blue')} 
                  />
                  <div>Blue</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="purple" id="purple" className="sr-only" />
                <Label htmlFor="purple" className="flex items-center space-x-2 cursor-pointer">
                  <ColorPalette 
                    color="bg-gradient-to-br from-purple-500 to-purple-700" 
                    isSelected={settings.colorPalette === 'purple'} 
                    onClick={() => handleChange('colorPalette', 'purple')} 
                  />
                  <div>Purple</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="green" id="green" className="sr-only" />
                <Label htmlFor="green" className="flex items-center space-x-2 cursor-pointer">
                  <ColorPalette 
                    color="bg-gradient-to-br from-emerald-500 to-emerald-700" 
                    isSelected={settings.colorPalette === 'green'} 
                    onClick={() => handleChange('colorPalette', 'green')} 
                  />
                  <div>Green</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
};

export default GeneralSettings;
