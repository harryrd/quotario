
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const NotificationsSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    documentReminders: true,
    paymentNotifications: true,
    marketingEmails: false,
  });

  const handleToggleChange = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newValue = !prev[key];
      
      // In a real app, this would save to a database or API
      toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${newValue ? 'enabled' : 'disabled'}`);
      
      return { ...prev, [key]: newValue };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your notification preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive email notifications about your documents</p>
          </div>
          <Switch 
            id="emailNotifications" 
            checked={settings.emailNotifications}
            onCheckedChange={() => handleToggleChange('emailNotifications')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="pushNotifications" className="text-base">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
          </div>
          <Switch 
            id="pushNotifications" 
            checked={settings.pushNotifications}
            onCheckedChange={() => handleToggleChange('pushNotifications')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="documentReminders" className="text-base">Document Reminders</Label>
            <p className="text-sm text-muted-foreground">Get reminders about upcoming and overdue documents</p>
          </div>
          <Switch 
            id="documentReminders" 
            checked={settings.documentReminders}
            onCheckedChange={() => handleToggleChange('documentReminders')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="paymentNotifications" className="text-base">Payment Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications when payments are received</p>
          </div>
          <Switch 
            id="paymentNotifications" 
            checked={settings.paymentNotifications}
            onCheckedChange={() => handleToggleChange('paymentNotifications')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="marketingEmails" className="text-base">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">Receive promotional emails and tips</p>
          </div>
          <Switch 
            id="marketingEmails" 
            checked={settings.marketingEmails}
            onCheckedChange={() => handleToggleChange('marketingEmails')}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;
