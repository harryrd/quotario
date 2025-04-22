
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserSettings } from './index';
import { Sun, Moon } from 'lucide-react';

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

      <div className="space-y-2 mt-4">
        <Label htmlFor="themeMode">Theme Mode</Label>
        <Select 
          value={settings.themeMode || 'light'} 
          onValueChange={(value) => onSettingChange('themeMode', value)}
        >
          <SelectTrigger id="themeMode">
            <SelectValue placeholder="Select theme mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-2" />
                <span>Light</span>
              </div>
            </SelectItem>
            <SelectItem value="dark">
              <div className="flex items-center">
                <Moon className="h-4 w-4 mr-2" />
                <span>Dark</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
