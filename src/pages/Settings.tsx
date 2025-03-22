
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building, CreditCard, Bell, Lock, HelpCircle, LogOut, ChevronRight, Settings as SettingsIcon, Users, FileText, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/components/AuthContext';

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
    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-sm">{title}</h3>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </motion.button>
);

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
                  onClick={() => navigate('/settings/profile')}
                />
                <Separator />
                <SettingsItem 
                  icon={Building} 
                  title="Business Details"
                  description="Update your business information"
                  onClick={() => navigate('/settings/business')}
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
                  onClick={() => navigate('/settings/payment')}
                />
              </div>
            </section>
            
            <section>
              <h2 className="text-base font-medium mb-2">Data Management</h2>
              <div className="space-y-1 rounded-md border overflow-hidden">
                <SettingsItem 
                  icon={Users} 
                  title="Clients"
                  description="Manage your client database"
                  onClick={() => navigate('/settings/clients')}
                />
              </div>
            </section>
            
            <section>
              <h2 className="text-base font-medium mb-2">App Settings</h2>
              <div className="space-y-1 rounded-md border overflow-hidden">
                <SettingsItem 
                  icon={SettingsIcon} 
                  title="General"
                  description="Configure currency, numbering and formats"
                  onClick={() => navigate('/settings/general')}
                />
                <Separator />
                <SettingsItem 
                  icon={Bell} 
                  title="Notifications"
                  description="Configure notification preferences"
                  onClick={() => {}}
                />
                <Separator />
                <SettingsItem 
                  icon={Lock} 
                  title="Security"
                  description="Manage your security settings"
                  onClick={() => {}}
                />
                <Separator />
                <SettingsItem 
                  icon={Coffee} 
                  title="Ads Free"
                  description="Support the developer and remove ads"
                  onClick={() => navigate('/settings/ads-free')}
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
                  onClick={() => {}}
                />
              </div>
            </section>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mt-3"
              onClick={logout}
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
