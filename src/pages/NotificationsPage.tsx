
import React from 'react';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import NotificationsSettings from '@/components/settings/NotificationsSettings';

const NotificationsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Notifications" showBack />
      
      <div className="flex-1 p-4">
        <AnimatedTransition>
          <div className="border rounded-md p-6 bg-card">
            <NotificationsSettings />
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default NotificationsPage;
