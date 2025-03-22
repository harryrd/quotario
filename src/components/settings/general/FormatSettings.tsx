
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserSettings } from './index';

interface FormatSettingsProps {
  settings: UserSettings;
  onSettingChange: (field: keyof UserSettings, value: string) => void;
}

export const FormatSettings: React.FC<FormatSettingsProps> = ({ 
  settings, 
  onSettingChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="dateFormat">Date Format</Label>
        <Select 
          value={settings.dateFormat} 
          onValueChange={(value) => onSettingChange('dateFormat', value)}
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
          onValueChange={(value) => onSettingChange('language', value)}
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
    </>
  );
};
