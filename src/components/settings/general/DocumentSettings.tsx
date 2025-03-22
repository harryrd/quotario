
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserSettings } from './index';

interface DocumentSettingsProps {
  settings: UserSettings;
  onSettingChange: (field: keyof UserSettings, value: string) => void;
}

export const DocumentSettings: React.FC<DocumentSettingsProps> = ({ 
  settings, 
  onSettingChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select 
          value={settings.currency} 
          onValueChange={(value) => onSettingChange('currency', value)}
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
            onChange={(e) => onSettingChange('quotationPrefix', e.target.value)}
            placeholder="QUO-"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quotationStartNumber">Starting Number</Label>
          <Input
            id="quotationStartNumber"
            value={settings.quotationStartNumber}
            onChange={(e) => onSettingChange('quotationStartNumber', e.target.value)}
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
            onChange={(e) => onSettingChange('invoicePrefix', e.target.value)}
            placeholder="INV-"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceStartNumber">Starting Number</Label>
          <Input
            id="invoiceStartNumber"
            value={settings.invoiceStartNumber}
            onChange={(e) => onSettingChange('invoiceStartNumber', e.target.value)}
            placeholder="1001"
          />
        </div>
      </div>
    </>
  );
};
