
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Moon, Sun, Monitor } from 'lucide-react';
import { UserSettings } from './index';
import { useTheme } from '@/components/ThemeProvider';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onSettingChange: (field: keyof UserSettings, value: string) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ 
  settings, 
  onSettingChange 
}) => {
  const { resolvedTheme } = useTheme();
  
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
        <Label htmlFor="themeSelector">Theme Mode</Label>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1 mb-3">
          <span>Currently using: </span>
          <span className="flex items-center font-medium text-foreground">
            {resolvedTheme === "dark" ? (
              <><Moon className="h-3.5 w-3.5 mr-1" /> Dark</>
            ) : (
              <><Sun className="h-3.5 w-3.5 mr-1" /> Light</>
            )}
          </span>
        </div>
        <ToggleGroup 
          type="single" 
          value={settings.theme} 
          onValueChange={(value) => {
            if (value) {
              onSettingChange('theme', value);
            }
          }} 
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
    </>
  );
};
