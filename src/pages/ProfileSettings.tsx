
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import ProfileSettingsComponent from '@/components/settings/ProfileSettings';

const ProfileSettings: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Profile Settings" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="border rounded-md p-4">
            <ProfileSettingsComponent />
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default ProfileSettings;
