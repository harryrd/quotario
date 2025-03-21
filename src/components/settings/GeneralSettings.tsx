
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    currency: 'USD',
    quotationPrefix: 'QUO-',
    quotationStartNumber: '1001',
    invoicePrefix: 'INV-',
    invoiceStartNumber: '1001',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    fontSize: 'M',
  });

  const handleChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    toast.success('Settings saved successfully');
    
    // Apply font size globally
    document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
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
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
};

export default GeneralSettings;
