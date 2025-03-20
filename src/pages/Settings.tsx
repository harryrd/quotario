
import React from 'react';
import { motion } from 'framer-motion';
import { User, Building, CreditCard, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from '@/components/AnimatedTransition';

const SettingsItem: React.FC<{
  icon: React.ElementType;
  title: string;
  description?: string;
  onClick?: () => void;
}> = ({ icon: Icon, title, description, onClick }) => (
  <motion.button
    className="w-full flex items-center p-3 rounded-md text-left hover:bg-secondary/50 smooth-transition"
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
  >
    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-sm">{title}</h3>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  </motion.button>
);

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Settings" showBack />
      
      <div className="flex-1 p-3">
        <AnimatedTransition>
          <div className="grid gap-4">
            <section>
              <h2 className="text-base font-medium mb-2">Account</h2>
              <div className="space-y-1 rounded-md border overflow-hidden">
                <SettingsItem 
                  icon={User} 
                  title="Profile"
                  description="Manage your personal information"
                />
                <Separator />
                <SettingsItem 
                  icon={Building} 
                  title="Business Details"
                  description="Update your business information"
                />
              </div>
            </section>
            
            <section>
              <h2 className="text-base font-medium mb-2">Billing</h2>
              <div className="space-y-1 rounded-md border overflow-hidden">
                <SettingsItem 
                  icon={CreditCard} 
                  title="Payment Methods"
                  description="Manage your payment methods"
                />
              </div>
            </section>
            
            <section>
              <h2 className="text-base font-medium mb-2">App Settings</h2>
              <div className="space-y-1 rounded-md border overflow-hidden">
                <SettingsItem 
                  icon={Bell} 
                  title="Notifications"
                  description="Configure notification preferences"
                />
                <Separator />
                <SettingsItem 
                  icon={Lock} 
                  title="Security"
                  description="Manage your security settings"
                />
              </div>
            </section>
            
            <section>
              <h2 className="text-base font-medium mb-2">Support</h2>
              <div className="space-y-1 rounded-md border overflow-hidden">
                <SettingsItem 
                  icon={HelpCircle} 
                  title="Help & Support"
                  description="Get help with using the app"
                />
              </div>
            </section>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mt-3 text-xs h-8"
            >
              <LogOut className="h-3 w-3" />
              <span>Log Out</span>
            </Button>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Settings;
