
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserSettings } from './index';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onSettingChange: (field: keyof UserSettings, value: string) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ 
  settings, 
  onSettingChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fontSize">Font Size</Label>
        <Select 
          value={settings.fontSize} 
          onValueChange={(value) => onSettingChange('fontSize', value)}
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
    </>
  );
};
