
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building, CreditCard, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BusinessDetails from '@/components/settings/BusinessDetails';
import PaymentMethods from '@/components/settings/PaymentMethods';

const SettingsItem: React.FC<{
  icon: React.ElementType;
  title: string;
  description?: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon: Icon, title, description, active, onClick }) => (
  <motion.button
    className={`w-full flex items-center p-3 rounded-md text-left hover:bg-secondary/50 smooth-transition ${active ? 'bg-secondary' : ''}`}
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

type SettingsCategory = 'profile' | 'business' | 'payment' | 'notifications' | 'security' | 'support';

const Settings: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('profile');

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
                  active={activeCategory === 'profile'}
                  onClick={() => setActiveCategory('profile')}
                />
                <Separator />
                <SettingsItem 
                  icon={Building} 
                  title="Business Details"
                  description="Update your business information"
                  active={activeCategory === 'business'}
                  onClick={() => setActiveCategory('business')}
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
                  active={activeCategory === 'payment'}
                  onClick={() => setActiveCategory('payment')}
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
                  active={activeCategory === 'notifications'}
                  onClick={() => setActiveCategory('notifications')}
                />
                <Separator />
                <SettingsItem 
                  icon={Lock} 
                  title="Security"
                  description="Manage your security settings"
                  active={activeCategory === 'security'}
                  onClick={() => setActiveCategory('security')}
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
                  active={activeCategory === 'support'}
                  onClick={() => setActiveCategory('support')}
                />
              </div>
            </section>
            
            <div className="mt-4 p-4 border rounded-md">
              {activeCategory === 'profile' && <ProfileSettings />}
              {activeCategory === 'business' && <BusinessDetails />}
              {activeCategory === 'payment' && <PaymentMethods />}
              {activeCategory === 'notifications' && (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">Notification settings coming soon</p>
                </div>
              )}
              {activeCategory === 'security' && (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">Security settings coming soon</p>
                </div>
              )}
              {activeCategory === 'support' && (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">Support options coming soon</p>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mt-3 text-xs h-10"
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
