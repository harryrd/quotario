
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
    className="w-full flex items-center p-4 rounded-lg text-left hover:bg-secondary/50 smooth-transition"
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
  >
    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  </motion.button>
);

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Settings" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="grid gap-6">
            <section>
              <h2 className="text-lg font-medium mb-2">Account</h2>
              <div className="space-y-1 rounded-lg border overflow-hidden">
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
              <h2 className="text-lg font-medium mb-2">Billing</h2>
              <div className="space-y-1 rounded-lg border overflow-hidden">
                <SettingsItem 
                  icon={CreditCard} 
                  title="Payment Methods"
                  description="Manage your payment methods"
                />
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-medium mb-2">App Settings</h2>
              <div className="space-y-1 rounded-lg border overflow-hidden">
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
              <h2 className="text-lg font-medium mb-2">Support</h2>
              <div className="space-y-1 rounded-lg border overflow-hidden">
                <SettingsItem 
                  icon={HelpCircle} 
                  title="Help & Support"
                  description="Get help with using the app"
                />
              </div>
            </section>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mt-4"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Settings;
